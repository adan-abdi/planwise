import React, { useState } from "react";
import { Check, GripVertical, ArrowRight, Info, Copy } from "lucide-react";
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

const checklistData = [
  { label: "Partner", found: false, value: "-", source: null, confidence: null },
  { label: "Client name", found: true, value: "Albert Flores", source: "policy doc_1", confidence: 99 },
  { label: "Client DOB", found: true, value: "23 July 1999", source: "policy doc_1", confidence: 88 },
  { label: "SJP SRA", found: false, value: "-", source: null, confidence: null },
  { label: "Recommended Fund Choice", found: true, value: "K1056168932", source: "policy doc_1", confidence: 99 },
  { label: "Checklist completed by", found: false, value: "-", source: null, confidence: null },
  { label: "Provider", found: true, value: "Standard Life", source: null, confidence: null },
  { label: "Policy Number", found: true, value: "PN123456789", source: "policy doc_2", confidence: 97 },
  { label: "Plan Type", found: true, value: "Retirement", source: "policy doc_2", confidence: 95 },
  { label: "Start Date", found: true, value: "01 Jan 2020", source: "policy doc_2", confidence: 98 },
  { label: "End Date", found: false, value: "-", source: null, confidence: null },
  { label: "Annual Premium", found: true, value: "$1,200", source: "policy doc_2", confidence: 99 },
  { label: "Beneficiary", found: false, value: "-", source: null, confidence: null },
  { label: "Advisor", found: true, value: "Jane Doe", source: "policy doc_3", confidence: 96 },
  { label: "Risk Level", found: true, value: "Medium", source: "policy doc_3", confidence: 92 },
  { label: "Notes", found: false, value: "-", source: null, confidence: null },
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

function SortableChecklistItem({ id, idx, item, darkMode, checked, handleToggle, editingIdx, setEditingIdx, inputValue, setInputValue, handleInputChange, handleInputBlur, handleInputKeyDown, values, cardBg, cardText, subtleRadius, badgeFound, badgeWarn, badgeBg, notFoundText, notFoundBg, borderColor, Info, ArrowRight, inputText, gap, squirkleRadius, checkBg, checkBorder, checkShadow }: SortableChecklistItemProps) {
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
        minHeight: 64,
        gap: gap,
        background: 'transparent',
        cursor: item.found ? 'pointer' : 'default',
        transition: 'background 0.15s',
      }}
      onClick={() => handleToggle(idx)}
      {...attributes}
    >
      <div
        style={{ width: 28, display: 'flex', justifyContent: 'center', alignItems: 'center', color: darkMode ? '#fff' : '#000', cursor: 'grab', flexShrink: 0 }}
        {...listeners}
        tabIndex={0}
        aria-label="Drag to reorder"
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
        padding: '0 20px',
      }}>
        <span style={{ fontSize: 15, fontWeight: 500, color: cardText }}>{item.label}</span>
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
          fontSize: 15,
          color: values[idx] === '' ? notFoundText : cardText,
          fontWeight: 500,
          padding: '0 20px',
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
      <div style={{
        width: 56,
        minWidth: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: checkBg,
        borderRadius: squirkleRadius,
      }}>
        {item.found ? (
          <div
            onClick={e => { e.stopPropagation(); handleToggle(idx); }}
            style={{
              border: `1.5px solid ${checkBorder}`,
              borderRadius: squirkleRadius,
              background: checkBg,
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: checkShadow,
              transition: 'box-shadow 0.15s',
            }}
            tabIndex={0}
            aria-label={checked[idx] ? 'Uncheck' : 'Check'}
          >
            {checked[idx] && <Check size={18} color={cardText} />}
          </div>
        ) : (
          <div style={{ width: 40, height: 40 }} />
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

  return (
    <div style={{ padding: 32, width: '100%', height: '100%', background: bgMain, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, color: cardText, margin: 0 }}>{checklistTitle || 'Ceding 1 Checklist'}</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{
            border: `1.5px solid ${borderColor}`,
            borderRadius: 8,
            background: 'transparent',
            color: cardText,
            fontWeight: 500,
            fontSize: 14,
            padding: '8px 16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.15s',
          }}>Add Item</button>
          <button style={{
            border: `1.5px solid ${borderColor}`,
            borderRadius: 8,
            background: 'transparent',
            color: cardText,
            fontWeight: 500,
            fontSize: 14,
            padding: '8px 16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.15s',
          }}>Export Missing Info</button>
        </div>
      </div>
      <div style={{ borderRadius: 16, minHeight: 0, padding: 0, display: 'flex', flexDirection: 'column', flex: 1 }}>
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
            <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column', gap: gap, paddingRight: 16 }}>
              {items.map((itemIdx, idx) => (
                <SortableChecklistItem
                  key={checklistData[itemIdx].label + itemIdx}
                  id={itemIdx}
                  idx={idx}
                  item={checklistData[itemIdx]}
                  darkMode={darkMode}
                  checked={checked}
                  handleToggle={handleToggle}
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
    </div>
  );
};

export default ChecklistParser; 