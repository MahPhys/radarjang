import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Check, 
  AlertTriangle, 
  Filter, 
  Newspaper 
} from 'lucide-react';
import { NewsItem, Category } from '../../types';
import { dbStore } from '../../data/dbStore';
import { getCategoryLabel, toPersianDigits } from '../../utils/formatters';

interface ManageNewsProps {
  news: NewsItem[];
  onRefresh: () => void;
}

export const ManageNews: React.FC<ManageNewsProps> = ({ news, onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    source: '',
    category: 'military' as 'military' | 'diplomatic' | 'economic' | 'intelligence',
    priority: 'medium' as 'high' | 'medium' | 'low',
    status: 'published' as 'published' | 'draft'
  });

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      summary: '',
      content: '',
      source: '',
      category: 'military',
      priority: 'medium',
      status: 'published'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: NewsItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      summary: item.summary,
      content: item.content,
      source: item.source,
      category: item.category,
      priority: item.priority,
      status: item.status
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      dbStore.updateNews(editingItem.id, formData);
    } else {
      dbStore.createNews({
        ...formData,
        published_at: new Date().toLocaleDateString('fa-IR') + ' - ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
      });
    }
    setIsModalOpen(false);
    onRefresh();
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      dbStore.deleteNews(deleteTargetId);
      setDeleteTargetId(null);
      onRefresh();
    }
  };

  const filteredNews = news.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">مدیریت رویدادها و اخبار (جدول news)</h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            ثبت، ویرایش و پایش اخبار خام پالایش‌شده مرتبط با منازعات ایران و آمریکا
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#B91C1C] hover:bg-[#991b1b] text-white text-xs sm:text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>ثبت خبر جدید</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="border border-zinc-800 bg-[#12141c] rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در اخبار و منابع..."
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

      {/* News Table */}
      <div className="border border-zinc-800 bg-[#12141c] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs sm:text-sm">
            <thead className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 font-mono text-[11px]">
              <tr>
                <th className="p-3 sm:p-4">عنوان رویداد</th>
                <th className="p-3 sm:p-4">دسته‌بندی</th>
                <th className="p-3 sm:p-4">منبع</th>
                <th className="p-3 sm:p-4">اولویت</th>
                <th className="p-3 sm:p-4">وضعیت</th>
                <th className="p-3 sm:p-4">تاریخ انتشار</th>
                <th className="p-3 sm:p-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredNews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500">
                    هیچ خبری با این مشخصات یافت نشد.
                  </td>
                </tr>
              ) : (
                filteredNews.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="p-3 sm:p-4 font-semibold text-zinc-200 max-w-xs truncate">
                      {item.title}
                    </td>
                    <td className="p-3 sm:p-4 text-zinc-400">
                      {getCategoryLabel(item.category)}
                    </td>
                    <td className="p-3 sm:p-4 text-zinc-400 font-mono text-xs">
                      {item.source}
                    </td>
                    <td className="p-3 sm:p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.priority === 'high' ? 'bg-red-950/60 text-red-400 border border-red-800/40' :
                        item.priority === 'medium' ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40' :
                        'bg-zinc-800 text-zinc-400'
                      }`}>
                        {item.priority === 'high' ? 'فوری' : item.priority === 'medium' ? 'عادی' : 'پایین'}
                      </span>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#12141c] border border-zinc-800 rounded-xl p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'ویرایش رویداد خبری' : 'ثبت رویداد خبری جدید'}
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
                <label className="text-xs font-medium text-zinc-300">عنوان رویداد *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="عنوان مشخص و رسمی رویداد..."
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
                  <label className="text-xs font-medium text-zinc-300">سطح اولویت</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white"
                  >
                    <option value="high">فوری / بحرانی</option>
                    <option value="medium">متوسط</option>
                    <option value="low">عادی</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">وضعیت انتشار</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white"
                  >
                    <option value="published">منتشر شده در تارنما</option>
                    <option value="draft">پیش‌نویس داخلی</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">منبع خبر *</label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  required
                  placeholder="مثال: سنتکام، الجزیره، رویترز، تحلیل رهگیری دریایی..."
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#B91C1C]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">چکیده راهبردی (۱ الی ۲ جمله) *</label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  required
                  rows={2}
                  placeholder="خلاصه سریع و گزاره اصلی خبر..."
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#B91C1C]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">شرح کامل خبر</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  placeholder="جزئیات تکمیلی رویداد و شواهد میدانی..."
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#B91C1C]"
                />
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
                  ذخیره در پایگاه داده
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#12141c] border border-zinc-800 rounded-xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="text-sm font-bold text-white">تأیید حذف خبر</h4>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              آیا از حذف این رویداد از پایگاه داده اطمینان دارید؟ این عملیات غیرقابل بازگشت است.
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
