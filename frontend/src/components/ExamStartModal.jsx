import { useState, useEffect, useRef } from 'react'
import styles from './ExamStartModal.module.css'

export default function ExamStartModal({ bundle, onStart, onCancel }) {
  const [minutes, setMinutes] = useState(bundle?.exam_minutes || 120)
  const inputRef = useRef(null)

  useEffect(() => {
    // Focus input on open
    const t = setTimeout(() => inputRef.current?.select(), 60)
    return () => clearTimeout(t)
  }, [])

  if (!bundle) return null

  const numMinutes = Number(minutes)
  const isValid = numMinutes >= 5 && numMinutes <= 300

  const handleStart = () => {
    if (!isValid) return
    onStart(numMinutes)
  }

  const presets = [
    { label: '30 min', value: 30 },
    { label: '60 min', value: 60 },
    { label: '90 min', value: 90 },
    { label: '120 min', value: 120 },
  ]

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <span className={styles.icon}>{bundle.icon}</span>
          <div>
            <div className={styles.title}>Start Exam</div>
            <div className={styles.bundleName}>{bundle.name}</div>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.info}>
            <span>📋</span>
            <span>{bundle.scenario_ids?.length || '?'} scenarios · Recommended: <strong>{bundle.exam_minutes} min</strong></span>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Exam Duration</label>
            <div className={styles.presets}>
              {presets.map(p => (
                <button
                  key={p.value}
                  className={`${styles.preset} ${minutes === p.value ? styles.presetActive : ''}`}
                  onClick={() => setMinutes(p.value)}
                  style={{ '--bcolor': bundle.color }}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className={styles.customRow}>
              <input
                ref={inputRef}
                type="number"
                className={styles.input}
                value={minutes}
                min={5}
                max={300}
                onChange={e => setMinutes(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleStart()}
              />
              <span className={styles.unit}>minutes</span>
            </div>
            <div className={styles.hint}>
              {!isValid ? (
                <span style={{ color: 'var(--red)' }}>⚠ Duration must be between 5 and 300 minutes</span>
              ) : numMinutes < 60 ? '⚡ Speed run mode' :
               numMinutes <= 120 ? '🎯 Realistic exam timing' :
               '🧘 Relaxed practice pace'}
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
          <button
            className={styles.startBtn}
            onClick={handleStart}
            disabled={!isValid}
            style={{ background: bundle.color }}
          >
            ▶ Start Exam
          </button>
        </div>
      </div>
    </div>
  )
}
