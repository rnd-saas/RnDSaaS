import React, { useState } from 'react';
const [saving, setSaving] = useState(false);


async function persist() {
try {
setSaving(true);
const updated = await updateTask(task.id, { progress: pct, status });
onUpdated(updated);
} finally {
setSaving(false);
}
}


return (
<div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 text-left">
<div className="flex items-start justify-between gap-4">
<div>
<h3 className="text-base font-semibold leading-tight">{task.title}</h3>
{task.description && (
<p className="mt-1 text-sm text-gray-600">{task.description}</p>
)}
</div>
<span className="rounded-full bg-gray-100 px-2 py-1 text-xs capitalize text-gray-700">
{status.replace('_', ' ')}
</span>
</div>


<div className="mt-4">
<ProgressBar value={pct} />
</div>


<div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
<label className="text-sm">
<span className="mb-1 block text-gray-600">Progress</span>
<input
type="range"
min={0}
max={100}
value={pct}
onChange={(e) => setPct(Number(e.target.value))}
className="w-full"
/>
</label>


<label className="text-sm">
<span className="mb-1 block text-gray-600">Status</span>
<select
className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm"
value={status}
onChange={(e) => setStatus(e.target.value as TaskStatus)}
>
{statusOptions.map((o) => (
<option key={o.value} value={o.value}>
{o.label}
</option>
))}
</select>
</label>


<div className="flex items-end">
<Button className="w-full" disabled={saving} onClick={persist}>
{saving ? 'Saving…' : 'Save'}
</Button>
</div>
</div>


<p className="mt-3 text-xs text-gray-500">Updated {new Date(task.updated_at).toLocaleString()}</p>
</div>
);
};
