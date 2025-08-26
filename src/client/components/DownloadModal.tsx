import { useState } from 'react';
import { DatabaseEntry } from '../types/database';
import { downloadAsCSV, downloadAsJSON, downloadAsXML } from '../utils/downloadUtils';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DatabaseEntry[];
  filename: string;
}

export function DownloadModal({ isOpen, onClose, data, filename }: DownloadModalProps) {
  const [format, setFormat] = useState<'csv' | 'json' | 'xml'>('csv');

  if (!isOpen) return null;

  const handleDownload = () => {
    switch (format) {
      case 'csv':
        downloadAsCSV(data, filename);
        break;
      case 'json':
        downloadAsJSON(data, filename);
        break;
      case 'xml':
        downloadAsXML(data, filename);
        break;
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Download Options</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <p>Download {data.length} entries as:</p>
          
          <div className="format-options">
            <label className="format-option">
              <input
                type="radio"
                name="format"
                value="csv"
                checked={format === 'csv'}
                onChange={(e) => setFormat(e.target.value as 'csv')}
              />
              <span>CSV (Comma Separated Values)</span>
              <small>Best for Excel and spreadsheet applications</small>
            </label>
            
            <label className="format-option">
              <input
                type="radio"
                name="format"
                value="json"
                checked={format === 'json'}
                onChange={(e) => setFormat(e.target.value as 'json')}
              />
              <span>JSON (JavaScript Object Notation)</span>
              <small>Best for web applications and APIs</small>
            </label>
            
            <label className="format-option">
              <input
                type="radio"
                name="format"
                value="xml"
                checked={format === 'xml'}
                onChange={(e) => setFormat(e.target.value as 'xml')}
              />
              <span>XML (Extensible Markup Language)</span>
              <small>Best for structured data exchange</small>
            </label>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleDownload}>
            Download {format.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
}