import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  FileText, 
  AlertTriangle, 
  Eye, 
  Clock 
} from 'lucide-react';
import { AnalysisItem, Category, Severity } from '../../types';
import { dbStore } from '../../data/dbStore';
import { getCategoryLabel, getSeverityBadge, toPersianDigits } from '../../utils/formatters';

interface ManageAnalysesProps {
  analyses: AnalysisItem[];
  onRefresh: () => void;
}

export const ManageAnalyses: React.FC<ManageAnalysesProps> = ({ analyses, onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AnalysisItem | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    category: 'military' as 'military' | 'diplomatic' | 'economic' | 'intelligence',
    severity: 'medium' as Severity,
    historical_precedent: '',
    counter_analysis: '',
    model_used: 'xAI Grok 4.3 (Synthetic Consensus)',
    confidence_score: 90,
    read_time: '۵ دقیقه',
    tagsString: 'نظامی، خلیج فارس، بازدارندگی',
    status: 'published' as 'published' | 'draft'
  });

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      slug: '',
      summary: '',
      content: '',
      category: 'military',
      severity: 'medium',
      historical_precedent: '',
      counter_analysis: '',
      model_used: 'xAI Grok 4.3 (Synthetic Consensus)',
      confidence_score: 90,
      read_time: '۵ دقیقه',
      tagsString: 'نظامی، خلیج فارس، بازدارندگی',
      status: 'published'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AnalysisItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      slug: item.slug,
      summary: item.summary,
      content: item.content,
      category: item.category,
      severity: item.severity,
      historical_precedent: item.historical_precedent || '',
      counter_analysis: item.counter_analysis || '',
      model_used: item.model_used,
      confidence_score: item.confidence_score,
      read_time: item.read_time,
      tagsString: (item.tags || []).join('، '),
      status: item.status
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = formData.tagsString
      .split(/[،,]/)
      .map(t => t.trim())
      .filter(Boolean);

    const generatedSlug = formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-').slice(0, 50);

    if (editingItem) {
      dbStore.updateAnalysis(editingItem.id, {
        title: formData.title,
        slug: generatedSlug,
        summary: formData.summary,
        content: formData.content,
        category: formData.category,
        severity: formData.severity,
        historical_precedent: formData.historical_precedent,
        counter_analysis: formData.counter_analysis,
        model_used: formData.model_used,
        confidence_score: formData.confidence_score,
        read_time: formData.read_time,
        tags,
        status: formData.status
      });
    } else {
      dbStore.createAnalysis({
        title: formData.title,
        slug: generatedSlug,
        summary: formData.summary,
        content: formData.content,
        category: formData.category,
        severity: formData.severity,
        historical_precedent: formData.historical_precedent,
        counter_analysis: formData.counter_analysis,
        model_used: formData.model_used,
        confidence_score: formData.confidence_score,
        read_time: formData.read_time,
        tags,
        status: formData.status,
        published_at: new Date().toLocaleDateString('fa-IR')
      });
    }
    setIsModalOpen(false);
    onRefresh();
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      dbStore.deleteAnalysis(deleteTargetId);
      setDeleteTargetId(null);
      onRefresh();
    }
  };

  const filteredAnalyses = analyses.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">مدیریت تحلیل‌های راهبردی (جدول analyses)</h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            نگارش، ویرایش و مدیریت تحلیل‌های تخصصی منازعات ایران و آمریکا
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#B91C1C] hover:bg-[#991b1b] text-white text-xs sm:text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>نگارش تحلیل جدید</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="border border-zinc-800 bg-[#12141c] rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در عناوین و چکیده‌ها..."
            className="w-full pr-9 pl-3 py-2 bg-zinc-900 border border-zinc-700/80 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-[#B91C1C]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-zinc-400">دسته‌بندی:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-zinc-900 border border-zinc-700/80 rounded-lg text-xs text-white px-3 py-2 focus:outline-none focus:border-[#B91C1C]"
          >
            <option value="all">همه دسته‌ها</option>
            <option value="military">نظامی و تسلیحاتی</option>
            <option value="diplomatic">دیپلماتیک و سیاسی</option>
            <option value="economic">اقتصادی و تحریم</option>
            <option value="intelligence">اطلاعاتی و امنیتی</option>
          </select>
        </div>
      </div>

      {/* Analyses Table */}
      <div className="border border-zinc-800 bg-[#12141c] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs sm:text-sm">
            <thead className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 font-mono text-[11px]">
              <tr>
                <th className="p-3 sm:p-4">عنوان تحلیل</th>
                <th className="p-3 sm:p-4">دسته‌بندی</th>
                <th className="p-3 sm:p-4">سطح هشدار</th>
                <th className="p-3 sm:p-4">زمان مطالعه</th>
                <th className="p-3 sm:p-4">وضعیت</th>
                <th className="p-3 sm:p-4">تاریخ انتشار</th>
                <th className="p-3 sm:p-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredAnalyses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500">
                    هیچ تحلیلی با این مشخصات یافت نشد.
                  </td>
                </tr>
              ) : (
                filteredAnalyses.map((item) => {
                  const sev = getSeverityBadge(item.severity);
                  return (
                    <tr key={item.id} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="p-3 sm:p-4 font-bold text-zinc-200 max-w-sm truncate">
                        {item.title}
                      </td>
                      <td className="p-3 sm:p-4 text-zinc-400">
                        {getCategoryLabel(item.category)}
                      </td>
                      <td className="p-3 sm:p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${sev.bg} ${sev.text} ${sev.border}`}>
                          {sev.label}
                        </span>
                      </td>
                      <td className="p-3 sm:p-4 text-zinc-400 font-mono text-xs">
                        {item.read_time}
                      </td>
                      <td className="p-3 sm:p-4">
                        <span className={`text-[11px] font-mono ${item.status === 'published' ? 'text-emerald-400' : 'text-zinc-500'}`}>
                          {item.status === 'published' ? 'منتشرشده' : 'پیش‌نویس'}
                        </span>
                      </td>
                      <td className="p-3 sm:p-4 text-zinc-500 font-mono text-xs">
                        {item.published_at}
                      </td>
                      <td className="p-3 sm:p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800"
                            title="ویرایش"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTargetId(item.id)}
                            className="p-1.5 text-red-400 hover:text-red-300 rounded hover:bg-red-950/40"
                            title="حذف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-[#12141c] border border-zinc-800 rounded-xl p-6 space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'ویرایش تحلیل راهبردی' : 'نگارش تحلیل راهبردی جدید'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">عنوان گزارش راهبردی *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="عنوان جامع و دقیق تحلیلی..."
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#B91C1C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">دسته‌بندی</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white"
                  >
                    <option value="military">نظامی و تسلیحاتی</option>
                    <option value="diplomatic">دیپلماتیک و سیاسی</option>
                    <option value="economic">اقتصادی و تحریم</option>
                    <option value="intelligence">اطلاعاتی و امنیتی</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">سطح هشدار (Severity)</label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white"
                  >
                    <option value="critical">بحرانی (DEFCON-3)</option>
                    <option value="medium">متوسط (توازن فعال)</option>
                    <option value="low">نظارتی عادی</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">وضعیت انتشار</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white"
                  >
                    <option value="published">انتشار در سایت عمومی</option>
                    <option value="draft">پیش‌نویس</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">چکیده اجرایی و پیام اصلی *</label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  required
                  rows={2}
                  placeholder="چکیده کلیدی برای جعبه نکات راهبردی..."
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#B91C1C]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">متن کامل تحلیل (پشتیبانی از سرفصل با ###) *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows={6}
                  placeholder="متن مشروح، ارزیابی میدانی، تفکیک بیانیه‌ها از واقعیت..."
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white font-mono text-xs leading-relaxed focus:outline-none focus:border-[#B91C1C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">عبرت‌ها و تطبیق‌های تاریخی</label>
                  <textarea
                    value={formData.historical_precedent}
                    onChange={(e) => setFormData({ ...formData, historical_precedent: e.target.value })}
                    rows={2}
                    placeholder="مقایسه با بحران‌های مشابه گذشته..."
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">دیدگاه جایگزین و منتقدانه (Counter-Analysis)</label>
                  <textarea
                    value={formData.counter_analysis}
                    onChange={(e) => setFormData({ ...formData, counter_analysis: e.target.value })}
                    rows={2}
                    placeholder="ارزیابی متقابل و نقد فرضیات اولیه..."
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">کلیدواژه‌ها (با کاما جدا کنید)</label>
                  <input
                    type="text"
                    value={formData.tagsString}
                    onChange={(e) => setFormData({ ...formData, tagsString: e.target.value })}
                    placeholder="نظامی، تنگه هرمز، بازدارندگی..."
                    className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">مدل تحلیلی / سنتز</label>
                  <input
                    type="text"
                    value={formData.model_used}
                    onChange={(e) => setFormData({ ...formData, model_used: e.target.value })}
                    className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white text-xs"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#B91C1C] hover:bg-[#991b1b] text-white text-xs font-semibold"
                >
                  ذخیره تحلیل در D1
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#12141c] border border-zinc-800 rounded-xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="text-sm font-bold text-white">تأیید حذف تحلیل</h4>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              آیا از حذف کامل این گزارش راهبردی از پایگاه داده اطمینان دارید؟
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs"
              >
                انصراف
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-medium"
              >
                حذف نهایی
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
