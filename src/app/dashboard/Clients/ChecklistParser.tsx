import React, { useState, useEffect, useCallback } from "react";
import { Check, GripVertical, ArrowRight, Info, Copy, Trash2, X, Search } from "lucide-react";
import { useTheme } from "../../../theme-context";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { createPortal } from 'react-dom';

const mandatoryItems = [
  "Partner",
  "Client name", 
  "Client DOB",
  "SJP SRA",
  "Recommended Fund Choice",
  "Provider"
];

const AddItemModal = React.memo(function AddItemModal({ 
  showAddModal, 
  newItemName, 
  setNewItemName, 
  handleAddItem, 
  handleCloseAddModal, 
  darkMode 
}: {
  showAddModal: boolean;
  newItemName: string;
  setNewItemName: (value: string) => void;
  handleAddItem: () => void;
  handleCloseAddModal: () => void;
  darkMode: boolean;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewItemName(e.target.value);
  }, [setNewItemName]);

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddItem();
    } else if (e.key === 'Escape') {
      handleCloseAddModal();
    }
  }, [handleAddItem, handleCloseAddModal]);

  if (!mounted || !showAddModal) return null;

  const modalContent = (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: darkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      width: '100vw',
      height: '100vh',
    }}>
      <div style={{
        background: darkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.3)'}`,
        borderRadius: 16,
        padding: '32px',
        maxWidth: '480px',
        width: '90%',
        boxShadow: darkMode
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          : '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        transform: 'scale(1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 600,
            color: darkMode ? '#f1f5f9' : '#374151',
            margin: 0,
          }}>
            Add New Checklist Item
          </h2>
          <button
            onClick={handleCloseAddModal}
            style={{
              background: 'none',
              border: 'none',
              padding: '8px',
              cursor: 'pointer',
              borderRadius: '8px',
              color: darkMode ? '#9ca3af' : '#6b7280',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
              e.currentTarget.style.color = darkMode ? '#f1f5f9' : '#374151';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
              e.currentTarget.style.color = darkMode ? '#9ca3af' : '#6b7280';
            }}
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div style={{ marginBottom: '24px' }}>
          <p style={{
            fontSize: '14px',
            color: darkMode ? '#9ca3af' : '#6b7280',
            margin: '0 0 16px 0',
            lineHeight: '1.5',
          }}>
            Enter the name of the information you want to search for in the documents. The system will automatically search and populate the results.
          </p>
          
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: darkMode ? '#9ca3af' : '#6b7280',
            }}>
              <Search size={18} />
            </div>
            <input
              type="text"
              value={newItemName}
              onChange={handleInputChange}
              placeholder="e.g., Policy Number, Annual Premium, Risk Level..."
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                fontSize: '16px',
                border: `1px solid ${darkMode ? '#3f3f46' : '#d1d5db'}`,
                borderRadius: '12px',
                background: darkMode ? '#1e1e1e' : '#ffffff',
                color: darkMode ? '#f1f5f9' : '#374151',
                outline: 'none',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = darkMode ? '#52525b' : '#3b82f6';
                e.target.style.boxShadow = darkMode ? '0 0 0 3px rgba(82, 82, 91, 0.1)' : '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = darkMode ? '#3f3f46' : '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
              onKeyDown={handleInputKeyDown}
              autoFocus
            />
          </div>
        </div>
        
        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end',
        }}>
          <button
            onClick={handleCloseAddModal}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 500,
              border: `1px solid ${darkMode ? '#3f3f46' : '#d1d5db'}`,
              borderRadius: '8px',
              background: 'transparent',
              color: darkMode ? '#f1f5f9' : '#374151',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleAddItem}
            disabled={!newItemName.trim()}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 500,
              border: 'none',
              borderRadius: '8px',
              background: newItemName.trim() ? (darkMode ? '#2563eb' : '#2563eb') : (darkMode ? '#3f3f46' : '#e5e7eb'),
              color: newItemName.trim() ? '#ffffff' : (darkMode ? '#6b7280' : '#9ca3af'),
              cursor: newItemName.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (newItemName.trim()) {
                e.currentTarget.style.background = darkMode ? '#1d4ed8' : '#1d4ed8';
              }
            }}
            onMouseLeave={(e) => {
              if (newItemName.trim()) {
                e.currentTarget.style.background = darkMode ? '#2563eb' : '#2563eb';
              }
            }}
          >
            Add Item
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
});

const checklistData = [
  { label: "Partner", found: false, value: "-", source: null, confidence: null },
  { label: "Client name", found: true, value: "Albert Flores", source: "policy doc_1", confidence: 99 },
  { label: "Client DOB", found: true, value: "23 July 1999", source: "policy doc_1", confidence: 88 },
  { label: "SJP SRA", found: false, value: "-", source: null, confidence: null },
  { label: "Recommended Fund Choice", found: true, value: "K1056168932", source: "policy doc_1", confidence: 99 },
  { label: "Provider", found: true, value: "Standard Life", source: null, confidence: null },
  { label: "Policy Number", found: true, value: "PN123456789", source: "policy doc_2", confidence: 97 },
  { label: "Plan Type", found: true, value: "Retirement", source: "policy doc_2", confidence: 95 },
  { label: "Start Date", found: true, value: "01 Jan 2020", source: "policy doc_2", confidence: 98 },
  { label: "Annual Premium", found: true, value: "$1,200", source: "policy doc_2", confidence: 99 },
  { label: "Advisor", found: true, value: "Jane Doe", source: "policy doc_3", confidence: 96 },
  { label: "Risk Level", found: true, value: "Medium", source: "policy doc_3", confidence: 92 },
];

const subtleRadius = 6;
const squirkleRadius = '16px / 10px';
const gap = 16;

interface ChecklistParserProps {
  showFooterActions?: boolean;
  checklistTitle?: string;
}

interface SortableChecklistItemProps {
  id: number;
  idx: number;
  item: typeof checklistData[number];
  darkMode: boolean;
  checked: boolean[];
  handleToggle: (idx: number) => void;
  handleDelete: (idx: number) => void;
  isMandatory: boolean;
  editingIdx: number | null;
  setEditingIdx: React.Dispatch<React.SetStateAction<number | null>>;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputBlur: () => void;
  handleInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  values: string[];
  cardBg: string;
  cardText: string;
  subtleRadius: number;
  badgeFound: string;
  badgeWarn: string;
  badgeBg: string;
  notFoundText: string;
  notFoundBg: string;
  borderColor: string;
  Info: typeof Info;
  ArrowRight: typeof ArrowRight;
  inputText: string;
  gap: number;
  squirkleRadius: string;
  checkBg: string;
  checkBorder: string;
  checkShadow: string;
}

function SortableChecklistItem({ id, idx, item, darkMode, checked, handleToggle, handleDelete, isMandatory, editingIdx, setEditingIdx, inputValue, setInputValue, handleInputChange, handleInputBlur, handleInputKeyDown, values, cardBg, cardText, subtleRadius, badgeFound, badgeWarn, badgeBg, notFoundText, notFoundBg, borderColor, Info, ArrowRight, inputText, gap }: SortableChecklistItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    boxShadow: isDragging ? '0 8px 32px 0 rgba(40, 80, 200, 0.18), 0 1.5px 8px 0 rgba(0,0,0,0.10)' : undefined,
    zIndex: isDragging ? 100 : 'auto',
    borderRadius: isDragging ? `${subtleRadius}px` : undefined,
    border: isDragging ? `1.5px solid ${borderColor}` : undefined,
    padding: isDragging ? '8px 8px' : undefined,
  };

  const [copied, setCopied] = React.useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const valueToCopy = `${item.label}: ${values[idx] === '' ? '-' : values[idx]}`;
    navigator.clipboard.writeText(valueToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        display: 'flex',
        alignItems: 'stretch',
        minHeight: 52,
        gap: gap,
        background: 'transparent',
        cursor: item.found ? 'pointer' : 'default',
        transition: 'background 0.15s',
      }}
      onClick={() => handleToggle(idx)}
      {...attributes}
    >
      <div
        style={{ 
          width: 28, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          color: isMandatory ? (darkMode ? '#3b82f6' : '#2563eb') : (darkMode ? '#52525b' : '#52525b'), 
          cursor: 'grab', 
          flexShrink: 0 
        }}
        {...listeners}
        tabIndex={0}
        aria-label={isMandatory ? "Mandatory item - drag to reorder" : "Drag to reorder"}
      >
        <GripVertical size={22} />
      </div>
      <div style={{
        flex: 2,
        background: cardBg,
        borderRadius: `${subtleRadius}px 0 0 ${subtleRadius}px`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 16px',
      }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: cardText }}>{item.label}</span>
        <span style={{ fontSize: 12, color: darkMode ? '#bbb' : '#888', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
          {item.found ? (
            <>
              {item.source && <span style={{ color: cardText, fontWeight: 600, marginLeft: 3 }}>Found in <span style={{ fontWeight: 600, marginLeft: 3, color: cardText }}>{item.source}</span></span>}
              {item.confidence !== null && (
                <span style={{ color: item.confidence > 95 ? badgeFound : badgeWarn, background: badgeBg, fontWeight: 600 }}>{item.confidence}%</span>
              )}
            </>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ color: notFoundText, background: badgeBg, fontWeight: 500 }}>Not found</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, borderRadius: '50%', border: `1px solid ${borderColor}`, color: notFoundText, background: notFoundBg }}>
                <Info size={13} />
              </span>
            </span>
          )}
        </span>
      </div>
      <div style={{
        width: 48,
        minWidth: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: cardBg,
        borderRadius: subtleRadius,
      }}>
        <ArrowRight size={18} color={darkMode ? '#bbb' : '#888'} />
      </div>
      <div
        style={{
          flex: 2,
          background: cardBg,
          borderRadius: `0 ${subtleRadius}px ${subtleRadius}px 0`,
          display: 'flex',
          alignItems: 'center',
          fontSize: 14,
          color: values[idx] === '' ? notFoundText : cardText,
          fontWeight: 500,
          padding: '0 16px',
          cursor: 'text',
          position: 'relative',
        }}
        onClick={e => { e.stopPropagation(); setEditingIdx(idx); setInputValue(values[idx] || ''); }}
      >
        {editingIdx === idx ? (
          <input
            autoFocus
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            style={{
              width: '100%',
              fontSize: 15,
              fontWeight: 500,
              color: inputText,
              background: 'transparent',
              border: 'none',
              outline: 'none',
            }}
            placeholder="Enter value..."
          />
        ) : (
          <>
            {values[idx] === '' ? <span style={{ color: notFoundText }}>-</span> : values[idx]}
          </>
        )}
      </div>
      {/* Copy icon as its own segment */}
      <div style={{
        width: 40,
        minWidth: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: cardBg,
        borderRadius: subtleRadius,
      }}>
        <button
          onClick={handleCopy}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            verticalAlign: 'middle',
          }}
          tabIndex={0}
          aria-label="Copy label and value"
        >
          {copied ? <Check size={18} color={badgeFound} /> : <Copy size={18} color={darkMode ? '#bbb' : '#888'} />}
        </button>
      </div>
      {/* Delete button - enabled for non-mandatory, disabled for mandatory */}
      <div style={{
        width: 40,
        minWidth: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: cardBg,
        borderRadius: subtleRadius,
      }}>
        <button
          onClick={(e) => { 
            if (!isMandatory) {
              e.stopPropagation(); 
              handleDelete(idx); 
            }
          }}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: isMandatory ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            verticalAlign: 'middle',
            opacity: isMandatory ? 0.3 : 1,
          }}
          tabIndex={0}
          aria-label={isMandatory ? "Cannot delete mandatory item" : "Delete item"}
          disabled={isMandatory}
        >
          <Trash2 size={18} color={darkMode ? '#ef4444' : '#dc2626'} />
        </button>
      </div>
      <div style={{
        width: 40,
        minWidth: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: cardBg,
        borderRadius: subtleRadius,
      }}>
        {item.found ? (
          <button
            onClick={e => { e.stopPropagation(); handleToggle(idx); }}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              verticalAlign: 'middle',
              transition: 'all 0.2s ease',
            }}
            tabIndex={0}
            aria-label={checked[idx] ? 'Uncheck' : 'Check'}
          >
            {checked[idx] ? (
              <Check size={18} color={darkMode ? '#22c55e' : '#16a34a'} />
            ) : (
              <div style={{
                width: 18,
                height: 18,
                borderRadius: '3px',
                background: 'transparent',
                border: `2px solid ${darkMode ? '#6b7280' : '#9ca3af'}`,
                transition: 'all 0.2s ease',
              }} />
            )}
          </button>
        ) : (
          <div style={{
            width: 18,
            height: 18,
            borderRadius: '3px',
            background: darkMode ? '#374151' : '#e5e7eb',
            border: `2px solid ${darkMode ? '#4b5563' : '#d1d5db'}`,
            opacity: 0.3,
          }} />
        )}
      </div>
    </div>
  );
}

const ChecklistParser: React.FC<ChecklistParserProps> = ({ showFooterActions, checklistTitle }) => {
  const { darkMode } = useTheme();
  const [items, setItems] = useState(checklistData.map((_, i) => i));
  const [checked, setChecked] = useState(checklistData.map(item => !!item.found));
  const [values, setValues] = useState(checklistData.map(item => item.value === '-' ? '' : item.value));
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newItemName, setNewItemName] = useState<string>('');

  const bgMain = darkMode ? 'var(--background)' : '#fafafa';
  const cardBg = darkMode ? 'var(--muted)' : '#fff';
  const cardText = darkMode ? 'var(--foreground)' : '#222';
  const badgeBg = darkMode ? '#333' : '#f4f4f5';
  const badgeFound = darkMode ? '#22c55e' : '#22c55e';
  const badgeWarn = darkMode ? '#f59e42' : '#f59e42';
  const notFoundBg = darkMode ? '#232329' : '#fff';
  const notFoundText = darkMode ? '#bbb' : '#bbb';
  const borderColor = darkMode ? '#27272a' : '#e4e4e7';
  const inputText = darkMode ? 'var(--foreground)' : '#222';
  const checkBg = darkMode ? 'var(--muted)' : '#fff';
  const checkBorder = darkMode ? '#3f3f46' : '#e4e4e7';
  const checkShadow = darkMode ? '0 1px 2px 0 rgba(0,0,0,0.10)' : '0 1px 2px 0 rgba(0,0,0,0.03)';
  const footerBg = darkMode ? '#232329' : '#fff';
  const footerBorder = darkMode ? '#27272a' : '#f1f1f1';
  const footerBtnBg = darkMode ? '#232329' : '#fff';
  const footerBtnText = darkMode ? '#f4f4f5' : '#18181b';
  const footerBtnDisabled = darkMode ? '#232329' : '#fff';
  const footerBtnDisabledText = darkMode ? '#bbb' : '#bbb';
  const footerBtnPrimary = darkMode ? '#2563eb' : '#2563eb';
  const footerBtnPrimaryText = '#fff';

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleToggle = (idx: number) => {
    if (!checklistData[idx].found) return;
    setChecked(prev => {
      const arr = [...prev];
      arr[idx] = !arr[idx];
      return arr;
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    setValues(prev => {
      const arr = [...prev];
      arr[editingIdx!] = inputValue.trim();
      return arr;
    });
    setEditingIdx(null);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    } else if (e.key === 'Escape') {
      setEditingIdx(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.indexOf(Number(active.id));
      const newIndex = items.indexOf(Number(over.id));
      setItems(arrayMove(items, oldIndex, newIndex));
      setChecked(arrayMove(checked, oldIndex, newIndex));
      setValues(arrayMove(values, oldIndex, newIndex));
    }
  };

  const handleDeleteItem = (idx: number) => {
    // Get the actual item from checklistData
    const itemToDelete = items[idx];
    const itemLabel = checklistData[itemToDelete].label;
    
    // Check if the item is mandatory by its variable name
    if (mandatoryItems.includes(itemLabel)) return;
    
    // Find the actual item index in the items array
    setItems(prev => prev.filter(item => item !== itemToDelete));
    setChecked(prev => prev.filter((_, i) => i !== idx));
    setValues(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    
    // Simulate searching for the item in documents
    const isFound = Math.random() > 0.5; // Random for demo
    const foundValue = isFound ? `Found in document ${Math.floor(Math.random() * 3) + 1}` : '';
    
    // Add new item to checklistData
    const newItemIndex = checklistData.length;
    if (isFound) {
      const source = `doc_${Math.floor(Math.random() * 3) + 1}`;
      const confidence = Math.floor(Math.random() * 20) + 80;
      checklistData.push({
        label: newItemName.trim(),
        found: true,
        value: foundValue,
        source: source,
        confidence: confidence
      });
    } else {
      checklistData.push({
        label: newItemName.trim(),
        found: false,
        value: '-',
        source: null,
        confidence: null
      });
    }
    
    // Update state arrays
    setItems(prev => [...prev, newItemIndex]);
    setChecked(prev => [...prev, false]);
    setValues(prev => [...prev, isFound ? foundValue : '']);
    
    // Reset modal
    setNewItemName('');
    setShowAddModal(false);
  };

  const handleOpenAddModal = () => {
    setShowAddModal(true);
    setNewItemName('');
  };

  const handleCloseAddModal = useCallback(() => {
    setShowAddModal(false);
    setNewItemName('');
  }, []);





  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      background: bgMain, 
      display: 'flex', 
      flexDirection: 'column', 
      overflow: 'hidden',
      '--checkmark-animation': `
        @keyframes checkmarkAppear {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `
    } as React.CSSProperties}>
              <div style={{
          padding: '16px 12px 18px 12px',
          background: darkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(15px) saturate(180%)',
          WebkitBackdropFilter: 'blur(15px) saturate(180%)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '80px',
          borderBottom: `1px solid ${darkMode ? '#3f3f46' : '#e4e4e7'}`,
          marginBottom: '1px',
          borderTopRightRadius: 6,
          boxShadow: darkMode
            ? '0 1px 3px 0 rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
            : '0 1px 3px 0 rgba(31, 38, 135, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8, marginTop: 0 }}>
          <h2 style={{ 
            fontSize: 18, 
            color: darkMode ? '#f1f5f9' : '#374151', 
            margin: 0, 
            fontWeight: 600,
            flex: 1
          }}>{checklistTitle || 'Ceding 1 Checklist'}</h2>
          <button 
            onClick={handleOpenAddModal}
            style={{
              minWidth: 0,
              backgroundColor: darkMode ? 'var(--muted)' : 'white',
              border: `1px solid ${darkMode ? 'var(--border)' : '#e5e7eb'}`,
              borderRadius: 8,
              padding: '6px 12px',
              fontSize: 14,
              fontWeight: 400,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              color: darkMode ? 'var(--foreground)' : '#374151',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f9fafb';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = darkMode ? 'var(--muted)' : 'white';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <GripVertical className="w-4 h-4" />
            Add Item
          </button>
          <button style={{
            minWidth: 0,
            backgroundColor: darkMode ? 'var(--muted)' : 'white',
            border: `1px solid ${darkMode ? 'var(--border)' : '#e5e7eb'}`,
            borderRadius: 8,
            padding: '6px 12px',
            fontSize: 14,
            fontWeight: 400,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: darkMode ? 'var(--foreground)' : '#374151',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f9fafb';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = darkMode ? 'var(--muted)' : 'white';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            Export missing
          </button>
        </div>
        {/* Action buttons area */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <button style={{
            minWidth: 0,
            backgroundColor: darkMode ? 'var(--muted)' : 'white',
            border: `1px solid ${darkMode ? 'var(--border)' : '#e5e7eb'}`,
            borderRadius: 8,
            padding: '6px 12px',
            fontSize: 14,
            fontWeight: 400,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: darkMode ? 'var(--foreground)' : '#374151',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f9fafb';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = darkMode ? 'var(--muted)' : 'white';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Save checklist
          </button>
          <button style={{
            minWidth: 0,
            backgroundColor: darkMode ? 'var(--muted)' : 'white',
            border: `1px solid ${darkMode ? 'var(--border)' : '#e5e7eb'}`,
            borderRadius: 8,
            padding: '6px 12px',
            fontSize: 14,
            fontWeight: 400,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: darkMode ? 'var(--foreground)' : '#374151',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f9fafb';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = darkMode ? 'var(--muted)' : 'white';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            Email
          </button>
          <button style={{
            minWidth: 0,
            backgroundColor: darkMode ? 'var(--muted)' : 'white',
            border: `1px solid ${darkMode ? 'var(--border)' : '#e5e7eb'}`,
            borderRadius: 8,
            padding: '6px 12px',
            fontSize: 14,
            fontWeight: 400,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: darkMode ? 'var(--foreground)' : '#374151',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f9fafb';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = darkMode ? 'var(--muted)' : 'white';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download
          </button>
        </div>
      </div>
      <div style={{ borderRadius: 16, minHeight: 0, padding: '0 32px', display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <div style={{ display: 'flex', fontWeight: 500, fontSize: 15, padding: '24px 40px 8px 40px', color: cardText, background: 'transparent', flexShrink: 0 }}>
          <div style={{ flex: 2 }}>Requested Information</div>
          <div style={{ width: 40 }}></div>
          <div style={{ flex: 2 }}>What we found</div>
          <div style={{ width: 40 }}></div>
          <div style={{ width: 40 }}></div>
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minHeight: 0, display: 'flex', flexDirection: 'column', gap: gap, paddingRight: 16, paddingBottom: 16 }}>
              {items.map((itemIdx, idx) => (
                <SortableChecklistItem
                  key={checklistData[itemIdx].label + itemIdx}
                  id={itemIdx}
                  idx={idx}
                  item={checklistData[itemIdx]}
                  darkMode={darkMode}
                  checked={checked}
                  handleToggle={handleToggle}
                  handleDelete={handleDeleteItem}
                  isMandatory={mandatoryItems.includes(checklistData[itemIdx].label)}
                  editingIdx={editingIdx}
                  setEditingIdx={setEditingIdx}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  handleInputChange={handleInputChange}
                  handleInputBlur={handleInputBlur}
                  handleInputKeyDown={handleInputKeyDown}
                  values={values}
                  cardBg={cardBg}
                  cardText={cardText}
                  subtleRadius={subtleRadius}
                  badgeFound={badgeFound}
                  badgeWarn={badgeWarn}
                  badgeBg={badgeBg}
                  notFoundText={notFoundText}
                  notFoundBg={notFoundBg}
                  borderColor={borderColor}
                  Info={Info}
                  ArrowRight={ArrowRight}
                  inputText={inputText}
                  gap={gap}
                  squirkleRadius={squirkleRadius}
                  checkBg={checkBg}
                  checkBorder={checkBorder}
                  checkShadow={checkShadow}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        {showFooterActions && (
          <div style={{
            minHeight: 80,
            background: footerBg,
            borderTop: `1px solid ${footerBorder}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 16,
            padding: '0 32px',
            marginTop: 8,
            flexShrink: 0,
          }}>
            <button style={{
              border: `1.5px solid ${borderColor}`,
              borderRadius: 16,
              background: footerBtnBg,
              color: footerBtnText,
              fontWeight: 500,
              fontSize: 18,
              padding: '12px 28px',
              marginRight: 8,
              cursor: 'pointer',
            }}>Save as draft</button>
            <button style={{
              border: `1.5px solid ${borderColor}`,
              borderRadius: 16,
              background: footerBtnDisabled,
              color: footerBtnDisabledText,
              fontWeight: 500,
              fontSize: 18,
              padding: '12px 28px',
              marginRight: 8,
              cursor: 'not-allowed',
            }} disabled>Download file</button>
            <button style={{
              border: `1.5px solid ${borderColor}`,
              borderRadius: 16,
              background: footerBtnBg,
              color: footerBtnText,
              fontWeight: 500,
              fontSize: 18,
              padding: '12px 28px',
              marginRight: 8,
              cursor: 'pointer',
            }}>Send an email</button>
            <button style={{
              border: 'none',
              borderRadius: 16,
              background: footerBtnPrimary,
              color: footerBtnPrimaryText,
              fontWeight: 500,
              fontSize: 18,
              padding: '12px 28px',
              cursor: 'pointer',
            }}>Save and Continue</button>
          </div>
        )}
      </div>
      
      {/* Render the portal-based modal */}
      <AddItemModal 
        showAddModal={showAddModal}
        newItemName={newItemName}
        setNewItemName={setNewItemName}
        handleAddItem={handleAddItem}
        handleCloseAddModal={handleCloseAddModal}
        darkMode={darkMode}
      />
    </div>
  );
};

export default ChecklistParser; 