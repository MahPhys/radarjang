import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  File, 
  Image as ImageIcon, 
  Trash2, 
  Copy, 
  Check, 
  HardDrive, 
  ExternalLink, 
  Link as LinkIcon,
  Plus,
  Sparkles
} from 'lucide-react';
import { MediaFileItem } from '../../types';
import { dbStore } from '../../data/dbStore';
import { formatBytes, toPersianDigits } from '../../utils/formatters';

interface ManageMediaUploadsProps {
  files: MediaFileItem[];
  onRefresh: () => void;
}

export const ManageR2Uploads: React.FC<ManageMediaUploadsProps> = ({ files, onRefresh }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [externalUrl, setExternalUrl] = useState('');
  const [externalFilename, setExternalFilename] = useState('');
  const [showUrlModal, setShowUrlModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopyUrl = (file: MediaFileItem) => {
    navigator.clipboard.writeText(file.url);
    setCopiedId(file.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('آیا از حذف این فایل اطمینان دارید؟')) {
      dbStore.deleteMediaFile(id);
      onRefresh();
    }
  };

  const handleFiles = (uploadedFileList: FileList | null) => {
    if (!uploadedFileList || uploadedFileList.length === 0) return;
    setIsUploading(true);

    Array.from(uploadedFileList).forEach(file => {
      // Read as Data URL or generate local /uploads path for immediate display
      const reader = new FileReader();
      reader.onload = () => {
        const fileUrl = (reader.result as string) || `/uploads/${encodeURIComponent(file.name)}`;
        dbStore.addMediaFile({
          filename: file.name,
          size: file.size,
          mime_type: file.type || 'application/octet-stream',
          url: fileUrl,
          provider: 'local'
        });
        setIsUploading(false);
        onRefresh();
      };
      reader.onerror = () => {
        // Fallback to direct public path
        dbStore.addMediaFile({
          filename: file.name,
          size: file.size,
          mime_type: file.type || 'application/octet-stream',
          url: `/uploads/${encodeURIComponent(file.name)}`,
          provider: 'local'
        });
        setIsUploading(false);
        onRefresh();
      };

      if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
      } else {
        // Non-images simulate local public folder
        dbStore.addMediaFile({
          filename: file.name,
          size: file.size,
          mime_type: file.type || 'application/pdf',
          url: `/uploads/${encodeURIComponent(file.name)}`,
          provider: 'local'
        });
        setIsUploading(false);
        onRefresh();
      }
    });
  };

  const handleAddExternalUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!externalUrl) return;

    const inferredName = externalFilename.trim() || externalUrl.split('/').pop()?.split('?')[0] || 'media_asset.jpg';
    const isCloudinary = externalUrl.includes('cloudinary.com') || externalUrl.includes('res.cloudinary');

    dbStore.addMediaFile({
      filename: inferredName,
      size: 450000, // estimated
      mime_type: 'image/jpeg',
      url: externalUrl,
      provider: isCloudinary ? 'cloudinary' : 'external'
    });

    setExternalUrl('');
    setExternalFilename('');
    setShowUrlModal(false);
    onRefresh();
  };

  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">مدیریت رسانه، نقشه‌ها و اسناد (Media Storage)</h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            سازگار با Vercel: بارگذاری در پوشه <code className="text-red-400 font-mono">/public/uploads</code> یا سرویس ابری Cloudinary
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUrlModal(true)}
            className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <LinkIcon className="w-3.5 h-3.5 text-blue-400" />
            <span>افزودن لینک Cloudinary / وب</span>
          </button>

          <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <span>حجم کل: {formatBytes(totalBytes)}</span>
          </div>
        </div>
      </div>

      {/* Cloudinary / URL Quick Modal */}
      {showUrlModal && (
        <div className="p-5 rounded-xl border border-zinc-800 bg-[#161722] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>افزودن مستقیم لینک عکس یا فایل (Cloudinary / CDN)</span>
            </h3>
            <button 
              onClick={() => setShowUrlModal(false)}
              className="text-xs text-zinc-400 hover:text-white"
            >
              بستن ✕
            </button>
          </div>

          <form onSubmit={handleAddExternalUrl} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-7">
              <label className="block text-[11px] text-zinc-400 mb-1">نشانی تصویر (Cloudinary یا هر URL مستقیم)</label>
              <input
                type="url"
                required
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://res.cloudinary.com/... یا https://example.com/map.jpg"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                dir="ltr"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-[11px] text-zinc-400 mb-1">عنوان / نام فایل</label>
              <input
                type="text"
                value={externalFilename}
                onChange={(e) => setExternalFilename(e.target.value)}
                placeholder="satellite_map.jpg"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
              />
            </div>
            <div className="sm:col-span-2 flex items-end">
              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-[#B91C1C] hover:bg-red-700 text-white text-xs font-semibold transition-colors"
              >
                ثبت فایل
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Drag and Drop Upload Box */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`cursor-pointer border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-all ${
          isDragging 
            ? 'border-[#B91C1C] bg-[#B91C1C]/10' 
            : 'border-zinc-700/80 bg-[#12141c] hover:border-zinc-500'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFiles(e.target.files)}
          multiple
          className="hidden"
          accept="image/*,.pdf,.doc,.docx"
        />

        <div className="max-w-md mx-auto space-y-3 pointer-events-none">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-[#B91C1C] mx-auto">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div className="text-sm font-bold text-white">
            {isUploading ? 'در حال پردازش و ثبت فایل...' : 'برای آپلود فایل کلیک کنید یا فایل را به اینجا بکشید'}
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            پشتیبانی از تصاویر تحلیل نظامی (JPG, PNG, WebP) و گزارش‌های تحلیلی (PDF) - فایل‌ها در حافظه کش محلی / مسیر Public ذخیره می‌شوند.
          </p>
        </div>
      </div>

      {/* Media Files Table */}
      <div className="border border-zinc-800 bg-[#12141c] rounded-xl overflow-hidden shadow-sm space-y-3 p-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-xs text-zinc-400">
          <span className="font-bold text-white">آرشیو فایل‌های ثبت‌شده ({toPersianDigits(files.length)} مورد)</span>
          <span className="font-mono text-zinc-500">Ready for Vercel Deployment</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs sm:text-sm">
            <thead className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 font-mono text-[11px]">
              <tr>
                <th className="p-3">نوع</th>
                <th className="p-3">نام فایل</th>
                <th className="p-3">اندازه</th>
                <th className="p-3">سرویس</th>
                <th className="p-3">زمان ثبت</th>
                <th className="p-3 text-center">نشانی URL</th>
                <th className="p-3 text-center">حذف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {files.map((file) => {
                const isImage = file.mime_type.startsWith('image/');
                const isCopied = copiedId === file.id;

                return (
                  <tr key={file.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="p-3">
                      <div className="w-7 h-7 rounded bg-zinc-900 border border-zinc-700/80 flex items-center justify-center text-zinc-400">
                        {isImage ? <ImageIcon className="w-4 h-4 text-amber-400" /> : <File className="w-4 h-4 text-blue-400" />}
                      </div>
                    </td>
                    <td className="p-3 font-mono text-xs font-semibold text-zinc-200 max-w-xs truncate">
                      <div className="truncate">{file.filename}</div>
                      {isImage && file.url && (
                        <a 
                          href={file.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[10px] text-zinc-500 hover:text-red-400 inline-flex items-center gap-1 mt-0.5"
                        >
                          <span>مشاهده پیش‌نمایش</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </td>
                    <td className="p-3 text-zinc-400 font-mono text-xs">
                      {formatBytes(file.size)}
                    </td>
                    <td className="p-3 font-mono text-[11px]">
                      {file.provider === 'cloudinary' ? (
                        <span className="px-2 py-0.5 rounded bg-blue-950/60 text-blue-400 border border-blue-800/50">Cloudinary</span>
                      ) : file.provider === 'external' ? (
                        <span className="px-2 py-0.5 rounded bg-purple-950/60 text-purple-400 border border-purple-800/50">CDN</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">Public/Local</span>
                      )}
                    </td>
                    <td className="p-3 text-zinc-400 font-mono text-xs">
                      {file.uploaded_at}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleCopyUrl(file)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700/70 hover:border-zinc-500 text-xs text-zinc-300 transition-colors"
                        title="کپی لینک تصویر برای استفاده در تحلیل‌ها"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 text-[11px]">کپی شد</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-zinc-400" />
                            <span className="text-[11px]">کپی URL</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="p-1 text-red-400 hover:text-red-300 rounded hover:bg-red-950/40"
                        title="حذف فایل"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
