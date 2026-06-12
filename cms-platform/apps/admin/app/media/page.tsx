'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { authenticatedCmsFetch } from '../../lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MediaAsset {
  publicId: string;
  url: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  duration?: number;
  createdAt: string;
  resourceType: string;
}

interface SignatureResponse {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  signature: string;
}

type UploadState = 'idle' | 'uploading' | 'success' | 'error';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

const FOLDERS = [
  { id: 'team', label: 'Team Photos', accept: 'image/*', resourceType: 'image' },
  { id: 'portfolio', label: 'Portfolio', accept: 'image/*', resourceType: 'image' },
  { id: 'office', label: 'Office / Space', accept: 'image/*,video/*', resourceType: 'image' },
  { id: 'video', label: 'Videos', accept: 'video/*', resourceType: 'video' },
  { id: 'uploads', label: 'General Uploads', accept: 'image/*,video/*', resourceType: 'image' },
] as const;

type FolderId = typeof FOLDERS[number]['id'];

// ─── Component ────────────────────────────────────────────────────────────────

export default function MediaLibraryPage() {
  const [activeFolder, setActiveFolder] = useState<FolderId>('team');
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [copied, setCopied] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const folder = FOLDERS.find((f) => f.id === activeFolder) ?? FOLDERS[0];

  // ─── Load assets ──────────────────────────────────────────────────────────

  const loadAssets = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const endpoint = folder.resourceType === 'video'
        ? `/v1/admin/media/list-videos?folder=${activeFolder}`
        : `/v1/admin/media/list?folder=${activeFolder}`;
      const data = await authenticatedCmsFetch<{ assets: MediaAsset[] }>(endpoint);
      setAssets(data.assets);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load assets');
    } finally {
      setLoading(false);
    }
  }, [activeFolder, folder.resourceType]);

  useEffect(() => {
    void loadAssets();
    setSelectedAsset(null);
  }, [loadAssets]);

  // ─── Upload ──────────────────────────────────────────────────────────────

  async function uploadFile(file: File) {
    setUploadState('uploading');
    setUploadProgress(0);
    setUploadMessage(`Uploading ${file.name}…`);

    try {
      // 1. Get signed params from our API
      const sig = await authenticatedCmsFetch<SignatureResponse>(
        `/v1/admin/media/sign?folder=${activeFolder}`
      );

      // 2. Upload directly to Cloudinary
      const form = new FormData();
      form.append('file', file);
      form.append('api_key', sig.apiKey);
      form.append('timestamp', String(sig.timestamp));
      form.append('signature', sig.signature);
      form.append('folder', sig.folder);

      const resourceType = file.type.startsWith('video/') ? 'video' : 'image';

      const xhr = new XMLHttpRequest();
      xhr.open(
        'POST',
        `https://api.cloudinary.com/v1_1/${sig.cloudName}/${resourceType}/upload`
      );

      await new Promise<void>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            setUploadProgress(Math.round((e.loaded / e.total) * 100));
          }
        });
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`Upload failed: ${xhr.responseText}`));
        });
        xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
        xhr.send(form);
      });

      setUploadState('success');
      setUploadMessage(`✓ ${file.name} uploaded successfully`);
      // Reload assets
      setTimeout(() => {
        setUploadState('idle');
        setUploadMessage('');
        void loadAssets();
      }, 1800);
    } catch (e) {
      setUploadState('error');
      setUploadMessage(e instanceof Error ? e.message : 'Upload failed');
      setTimeout(() => { setUploadState('idle'); setUploadMessage(''); }, 4000);
    }
  }

  function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    void uploadFile(files[0]);
  }

  // ─── Drag & Drop ─────────────────────────────────────────────────────────

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    dropRef.current?.classList.add('drop-active');
  }
  function handleDragLeave() {
    dropRef.current?.classList.remove('drop-active');
  }
  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    dropRef.current?.classList.remove('drop-active');
    handleFiles(e.dataTransfer.files);
  }

  // ─── Delete ──────────────────────────────────────────────────────────────

  async function deleteAsset(publicId: string) {
    try {
      await authenticatedCmsFetch('/v1/admin/media/delete', {
        method: 'DELETE',
        body: JSON.stringify({
          publicId,
          resourceType: folder.resourceType
        })
      });
      setAssets((prev) => prev.filter((a) => a.publicId !== publicId));
      if (selectedAsset?.publicId === publicId) setSelectedAsset(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setDeleteConfirm(null);
    }
  }

  // ─── Copy ────────────────────────────────────────────────────────────────

  function copyPublicId(id: string) {
    void navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <section className="page" style={{ padding: '32px' }}>
      {/* Header */}
      <div className="page-heading" style={{ marginBottom: '28px' }}>
        <div>
          <span>Media</span>
          <h1 style={{ fontSize: 'clamp(28px,3.5vw,48px)' }}>Media Library</h1>
          <p>Upload images and videos to Cloudinary, then copy the public ID to use them on your website.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px,220px) minmax(0,1fr)', gap: '22px', alignItems: 'start', maxWidth: '1400px' }}>

        {/* ── Sidebar ── */}
        <div className="panel" style={{ padding: '14px', position: 'sticky', top: '94px' }}>
          <p style={{ color: 'var(--muted)', fontSize: '10px', fontWeight: 900, letterSpacing: '.12em', textTransform: 'uppercase', margin: '0 6px 10px' }}>Folders</p>
          <nav style={{ display: 'grid', gap: '5px' }}>
            {FOLDERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFolder(f.id)}
                style={{
                  background: activeFolder === f.id ? 'var(--orange-soft)' : 'transparent',
                  border: `1px solid ${activeFolder === f.id ? '#f5c5a7' : 'transparent'}`,
                  borderRadius: '10px',
                  color: activeFolder === f.id ? 'var(--orange-dark)' : 'var(--ink)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: activeFolder === f.id ? 800 : 500,
                  padding: '10px 13px',
                  textAlign: 'left',
                  transition: 'all .18s'
                }}
              >
                {f.id === 'team' ? '👤' : f.id === 'portfolio' ? '🗂' : f.id === 'office' ? '🏢' : f.id === 'video' ? '🎬' : '📁'} {f.label}
              </button>
            ))}
          </nav>
        </div>

        {/* ── Main panel ── */}
        <div style={{ display: 'grid', gap: '18px' }}>

          {/* Upload zone */}
          <div
            ref={dropRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => uploadState === 'idle' && fileInputRef.current?.click()}
            style={{
              background: uploadState === 'uploading' ? 'rgba(242,107,33,.05)' :
                uploadState === 'success' ? 'rgba(34,132,90,.05)' :
                uploadState === 'error' ? 'rgba(183,59,45,.05)' : 'var(--surface)',
              border: `2px dashed ${uploadState === 'success' ? '#22845a' : uploadState === 'error' ? '#b73b2d' : 'var(--line-strong)'}`,
              borderRadius: '18px',
              cursor: uploadState === 'idle' ? 'pointer' : 'default',
              padding: '36px 28px',
              textAlign: 'center',
              transition: 'all .2s'
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={folder.accept}
              style={{ display: 'none' }}
              onChange={(e) => handleFiles(e.target.files)}
            />
            {uploadState === 'idle' && (
              <>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>
                  {folder.resourceType === 'video' ? '🎬' : '🖼️'}
                </div>
                <strong style={{ display: 'block', fontSize: '15px', marginBottom: '6px' }}>
                  Drop a file here or click to browse
                </strong>
                <span style={{ color: 'var(--muted)', fontSize: '12px' }}>
                  Uploading to <code style={{ background: 'var(--canvas)', borderRadius: '5px', padding: '2px 6px' }}>{activeFolder}/</code> folder on Cloudinary
                </span>
              </>
            )}
            {uploadState === 'uploading' && (
              <div style={{ display: 'grid', gap: '14px' }}>
                <strong style={{ color: 'var(--orange-dark)', fontSize: '14px' }}>{uploadMessage}</strong>
                <div style={{ background: 'var(--line)', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                  <div style={{ background: 'var(--orange)', borderRadius: '999px', height: '100%', transition: 'width .3s', width: `${uploadProgress}%` }} />
                </div>
                <span style={{ color: 'var(--muted)', fontSize: '12px' }}>{uploadProgress}%</span>
              </div>
            )}
            {uploadState === 'success' && (
              <strong style={{ color: 'var(--green)', fontSize: '14px' }}>{uploadMessage}</strong>
            )}
            {uploadState === 'error' && (
              <strong style={{ color: '#b73b2d', fontSize: '14px' }}>{uploadMessage}</strong>
            )}
          </div>

          {/* Error banner */}
          {error && (
            <div style={{ background: '#fff1ef', border: '1px solid #f3c0bb', borderRadius: '12px', color: '#b73b2d', fontSize: '13px', padding: '14px 16px' }}>
              {error}
            </div>
          )}

          {/* Asset grid */}
          <div className="panel" style={{ padding: '22px' }}>
            <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div>
                <strong style={{ fontSize: '14px' }}>{folder.label}</strong>
                <span style={{ color: 'var(--muted)', display: 'block', fontSize: '12px' }}>
                  {loading ? 'Loading…' : `${assets.length} asset${assets.length !== 1 ? 's' : ''}`}
                </span>
              </div>
              <button
                className="button-secondary"
                onClick={() => void loadAssets()}
                disabled={loading}
                style={{ fontSize: '12px', padding: '8px 12px' }}
              >
                ↻ Refresh
              </button>
            </div>

            {loading ? (
              <div style={{ color: 'var(--muted)', fontSize: '13px', padding: '40px 0', textAlign: 'center' }}>
                Loading assets…
              </div>
            ) : assets.length === 0 ? (
              <div style={{ color: 'var(--muted)', fontSize: '13px', padding: '40px 0', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>📭</div>
                No assets in this folder yet. Upload one above.
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
                {assets.map((asset) => (
                  <div
                    key={asset.publicId}
                    onClick={() => setSelectedAsset(asset)}
                    style={{
                      background: selectedAsset?.publicId === asset.publicId ? 'var(--orange-soft)' : 'var(--surface-soft)',
                      border: `2px solid ${selectedAsset?.publicId === asset.publicId ? '#f5c5a7' : 'var(--line)'}`,
                      borderRadius: '14px',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      transition: 'all .18s'
                    }}
                  >
                    {/* Thumbnail */}
                    <div style={{ aspectRatio: '4/3', background: 'var(--canvas)', overflow: 'hidden', position: 'relative' }}>
                      {asset.resourceType === 'video' ? (
                        <div style={{ alignItems: 'center', display: 'flex', height: '100%', justifyContent: 'center', fontSize: '30px' }}>🎬</div>
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={asset.url.replace('/upload/', '/upload/c_fill,h_200,w_250,q_auto,f_auto/')}
                          alt={asset.publicId}
                          style={{ display: 'block', height: '100%', objectFit: 'cover', width: '100%' }}
                          loading="lazy"
                        />
                      )}
                    </div>
                    {/* Label */}
                    <div style={{ padding: '10px 11px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {asset.publicId.split('/').pop()}
                      </div>
                      <div style={{ color: 'var(--muted)', fontSize: '10px', marginTop: '3px' }}>
                        {formatBytes(asset.bytes)} · {asset.format.toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Asset detail / info panel */}
          {selectedAsset && (
            <div className="panel" style={{ padding: '22px' }}>
              <div style={{ alignItems: 'flex-start', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>

                {/* Preview */}
                <div style={{ background: 'var(--canvas)', borderRadius: '12px', flexShrink: 0, overflow: 'hidden', width: '180px' }}>
                  {selectedAsset.resourceType === 'video' ? (
                    <video
                      src={selectedAsset.url}
                      controls
                      style={{ display: 'block', width: '100%' }}
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selectedAsset.url.replace('/upload/', '/upload/c_fill,h_320,w_320,q_auto,f_auto/')}
                      alt={selectedAsset.publicId}
                      style={{ display: 'block', width: '100%' }}
                    />
                  )}
                </div>

                {/* Info */}
                <div style={{ display: 'grid', flex: 1, gap: '12px', minWidth: '200px' }}>
                  <div>
                    <div style={{ color: 'var(--muted)', fontSize: '10px', fontWeight: 900, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Public ID</div>
                    <div style={{ alignItems: 'center', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <code style={{ background: 'var(--canvas)', borderRadius: '8px', fontSize: '12px', padding: '6px 10px', wordBreak: 'break-all' }}>
                        {selectedAsset.publicId}
                      </code>
                      <button
                        className="button-secondary"
                        onClick={() => copyPublicId(selectedAsset.publicId)}
                        style={{ fontSize: '11px', padding: '6px 10px', whiteSpace: 'nowrap' }}
                      >
                        {copied ? '✓ Copied' : 'Copy ID'}
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gap: '8px', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))' }}>
                    {[
                      ['Format', selectedAsset.format.toUpperCase()],
                      ['Size', formatBytes(selectedAsset.bytes)],
                      ...(selectedAsset.width ? [['Dimensions', `${selectedAsset.width} × ${selectedAsset.height}`]] : []),
                      ...(selectedAsset.duration ? [['Duration', `${selectedAsset.duration.toFixed(1)}s`]] : []),
                      ['Uploaded', formatDate(selectedAsset.createdAt)],
                    ].map(([label, value]) => (
                      <div key={label} style={{ background: 'var(--surface-soft)', borderRadius: '10px', padding: '10px 12px' }}>
                        <div style={{ color: 'var(--muted)', fontSize: '10px', fontWeight: 900, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: '4px' }}>{label}</div>
                        <div style={{ fontSize: '12px', fontWeight: 700 }}>{value}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                    <a
                      href={selectedAsset.url}
                      target="_blank"
                      rel="noreferrer"
                      className="button"
                      style={{ fontSize: '12px', padding: '9px 13px' }}
                    >
                      Open original ↗
                    </a>
                    {deleteConfirm === selectedAsset.publicId ? (
                      <>
                        <button
                          onClick={() => void deleteAsset(selectedAsset.publicId)}
                          style={{ background: '#b73b2d', border: 0, borderRadius: '10px', color: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 800, padding: '9px 13px' }}
                        >
                          Yes, delete
                        </button>
                        <button className="button-secondary" onClick={() => setDeleteConfirm(null)} style={{ fontSize: '12px', padding: '9px 13px' }}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        className="button-secondary"
                        onClick={() => setDeleteConfirm(selectedAsset.publicId)}
                        style={{ color: '#b73b2d', fontSize: '12px', padding: '9px 13px' }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
