import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  TrendingUp, 
  AlertTriangle 
} from 'lucide-react';
import { PredictionItem, Timeframe } from '../../types';
import { dbStore } from '../../data/dbStore';
import { toPersianDigits } from '../../utils/formatters';

interface ManagePredictionsProps {
  predictions: PredictionItem[];
  onRefresh: () => void;
}

export const ManagePredictions: React.FC<ManagePredictionsProps> = ({ predictions, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PredictionItem | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    timeframe: 'short' as Timeframe,
    timeframe_label: 'کوتاه‌مدت (۱ تا ۴ هفته)',
    probability: 50,
    primary_scenario: '',
    alternative_scenario: '',
    risk_level: 'medium' as 'critical' | 'high' | 'medium' | 'low',
    triggersString: 'رهگیری شناورها، مانورهای بدون اطلاع قبلی',
    status: 'published' as 'published' | 'draft'
  });

  const handleTimeframeChange = (tf: Timeframe) => {
    let label = 'کوتاه‌مدت (۱ تا ۴ هفته)';
    if (tf === 'mid') label = 'میان‌مدت (۱ تا ۶ ماه)';
    if (tf === 'long') label = 'بلندمدت (۶ ماه تا ۲ سال)';
    setFormData(prev => ({ ...prev, timeframe: tf, timeframe_label: label }));
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      timeframe: 'short',
      timeframe_label: 'کوتاه‌مدت (۱ تا ۴ هفته)',
      probability: 50,
      primary_scenario: '',
      alternative_scenario: '',
      risk_level: 'medium',
      triggersString: 'رهگیری شناورها، مانورهای موشکی، تنش دیپلماتیک',
      status: 'published'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: PredictionItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      timeframe: item.timeframe,
      timeframe_label: item.timeframe_label,
      probability: item.probability,
      primary_scenario: item.primary_scenario,
      alternative_scenario: item.alternative_scenario,
      risk_level: item.risk_level,
      triggersString: (item.trigger_events || []).join('، '),
      status: item.status
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const triggers = formData.triggersString
      .split(/[،,]/)
      .map(t => t.trim())
      .filter(Boolean);

    if (editingItem) {
      dbStore.updatePrediction(editingItem.id, {
        title: formData.title,
        timeframe: formData.timeframe,
        timeframe_label: formData.timeframe_label,
        probability: Number(formData.probability),
        primary_scenario: formData.primary_scenario,
        alternative_scenario: formData.alternative_scenario,
        risk_level: formData.risk_level,
        trigger_events: triggers,
        status: formData.status
      });
    } else {
      dbStore.createPrediction({
        title: formData.title,
        timeframe: formData.timeframe,
        timeframe_label: formData.timeframe_label,
        probability: Number(formData.probability),
        primary_scenario: formData.primary_scenario,
        alternative_scenario: formData.alternative_scenario,
        risk_level: formData.risk_level,
        trigger_events: triggers,
        status: formData.status
      });
    }
    setIsModalOpen(false);
    onRefresh();
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      dbStore.deletePrediction(deleteTargetId);
      setDeleteTargetId(null);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">مدیریت سناریوها و پیش‌بینی‌ها (جدول predictions)</h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            طراحی و تنظیم سناریوهای موازنه قوا و احتمال‌سنجی رویدادهای آینده
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#B91C1C] hover:bg-[#991b1b] text-white text-xs sm:text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>ثبت سناریوی جدید</span>
        </button>
      </div>

      {/* Predictions Table */}
      <div className="border border-zinc-800 bg-[#12141c] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs sm:text-sm">
            <thead className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 font-mono text-[11px]">
              <tr>
                <th className="p-3 sm:p-4">عنوان سناریو</th>
                <th className="p-3 sm:p-4">افق زمانی</th>
                <th className="p-3 sm:p-4">احتمال وقوع</th>
                <th className="p-3 sm:p-4">سطح ریسک</th>
                <th className="p-3 sm:p-4">وضعیت</th>
                <th className="p-3 sm:p-4">تاریخ ثبت</th>
                <th className="p-3 sm:p-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {predictions.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="p-3 sm:p-4 font-bold text-zinc-200 max-w-sm truncate">
                    {item.title}
                  </td>
                  <td className="p-3 sm:p-4 text-zinc-400 font-mono">
                    {item.timeframe_label}
                  </td>
                  <td className="p-3 sm:p-4">
                    <span className="font-mono font-bold text-red-400">
                      {toPersianDigits(item.probability)}٪
                    </span>
                  </td>
                  <td className="p-3 sm:p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-300 font-mono">
                      {item.risk_level}
                    </span>
                  </td>
                  <td className="p-3 sm:p-4">
                    <span className={`text-[11px] font-mono ${item.status === 'published' ? 'text-emerald-400' : 'text-zinc-500'}`}>
                      {item.status === 'published' ? 'منتشرشده' : 'پیش‌نویس'}
                    </span>
                  </td>
                  <td className="p-3 sm:p-4 text-zinc-500 font-mono text-xs">
                    {item.created_at}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#12141c] border border-zinc-800 rounded-xl p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'ویرایش سناریوی پیش‌بینی' : 'تعریف سناریوی پیش‌بینی جدید'}
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
                <label className="text-xs font-medium text-zinc-300">موضوع سناریو *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="مثال: احتمال درگیری دریایی در خلیج فارس..."
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#B91C1C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">افق زمانی</label>
                  <select
                    value={formData.timeframe}
                    onChange={(e) => handleTimeframeChange(e.target.value as Timeframe)}
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white"
                  >
                    <option value="short">کوتاه‌مدت (۱ تا ۴ هفته)</option>
                    <option value="mid">میان‌مدت (۱ تا ۶ ماه)</option>
                    <option value="long">بلندمدت (۶ ماه تا ۲ سال)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">
                    احتمال وقوع: {toPersianDigits(formData.probability)}٪
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={formData.probability}
                    onChange={(e) => setFormData({ ...formData, probability: Number(e.target.value) })}
                    className="w-full mt-2 accent-[#B91C1C]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">سطح ریسک</label>
                  <select
                    value={formData.risk_level}
                    onChange={(e) => setFormData({ ...formData, risk_level: e.target.value as any })}
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white"
                  >
                    <option value="critical">بحرانی (Critical)</option>
                    <option value="high">بالا (High)</option>
                    <option value="medium">متوسط (Medium)</option>
                    <option value="low">کم (Low)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">سناریوی مبنا (محتمل‌ترین نتیجه) *</label>
                <textarea
                  value={formData.primary_scenario}
                  onChange={(e) => setFormData({ ...formData, primary_scenario: e.target.value })}
                  required
                  rows={3}
                  placeholder="شرح دقیق محتمل‌ترین تحول میدانی یا دیپلماتیک..."
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#B91C1C]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">سناریوی جایگزین (آلترناتیو بحران)</label>
                <textarea
                  value={formData.alternative_scenario}
                  onChange={(e) => setFormData({ ...formData, alternative_scenario: e.target.value })}
                  rows={2}
                  placeholder="در صورت شکست مسیر مبنا، چه سناریویی رخ خواهد داد؟"
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#B91C1C]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">ماشه‌های بحران (Trigger Events) - با کاما جدا کنید</label>
                <input
                  type="text"
                  value={formData.triggersString}
                  onChange={(e) => setFormData({ ...formData, triggersString: e.target.value })}
                  placeholder="توقیف شناورها، شکست مذاکرات عمان، اعمال تحریم نفت..."
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white"
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

      {/* Delete Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#12141c] border border-zinc-800 rounded-xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="text-sm font-bold text-white">تأیید حذف سناریو</h4>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              آیا از حذف این سناریو از محاسبات آینده‌پژوهی اطمینان دارید؟
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
