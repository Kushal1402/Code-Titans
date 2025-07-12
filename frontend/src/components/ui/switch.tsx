import React from 'react';

type SwitchProps = {
    checked: boolean;
    onChange: (checked: boolean) => void;
};

const Switch: React.FC<SwitchProps> = ({ checked, onChange }) => (
    <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', gap: 8 }}>
        <span
            style={{
                width: 40,
                height: 22,
                background: checked ? '#4f46e5' : '#d1d5db',
                borderRadius: 22,
                position: 'relative',
                transition: 'background 0.2s',
                display: 'inline-block',
            }}
        >
            <span
                style={{
                    position: 'absolute',
                    left: checked ? 20 : 2,
                    top: 2,
                    width: 18,
                    height: 18,
                    background: '#fff',
                    borderRadius: '50%',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                    transition: 'left 0.2s',
                }}
            />
            <input
                type="checkbox"
                checked={checked}
                onChange={e => onChange(e.target.checked)}
                style={{ opacity: 0, width: 40, height: 22, position: 'absolute', left: 0, top: 0, margin: 0 }}
            />
        </span>
    </label>
);

export default Switch;