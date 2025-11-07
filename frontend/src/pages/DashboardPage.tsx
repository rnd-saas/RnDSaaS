import React, { useEffect, useMemo, useState } from 'react';
setError(null);
const [t, s] = await Promise.all([getMyTasks(), getMyProgressSummary()]);
setTasks(t);
setSummary({ total: s.total, avg_progress: s.avg_progress });
} catch (e: any) {
setError(e?.message ?? 'Failed to load dashboard');
} finally {
setLoading(false);
}
}


useEffect(() => {
load();
}, []);


const overall = useMemo(() => {
if (!tasks.length) return 0;
const sum = tasks.reduce((acc, t) => acc + (t.progress ?? 0), 0);
return Math.round(sum / tasks.length);
}, [tasks]);


function onTaskUpdated(updated: Task) {
setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
}


return (
<div className="mx-auto max-w-5xl space-y-6">
<header className="flex items-center justify-between">
<div>
<h1 className="text-2xl font-bold">Dashboard</h1>
<p className="text-sm text-gray-600">Your tasks and progress at a glance</p>
</div>
<Button onClick={load}>Refresh</Button>
</header>


{/* Overview card */}
<section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
<div className="grid gap-6 sm:grid-cols-3">
<div>
<p className="text-sm text-gray-500">Overall progress</p>
<p className="mt-1 text-3xl font-semibold tabular-nums">{overall}%</p>
</div>
<div>
<p className="text-sm text-gray-500">Tasks</p>
<p className="mt-1 text-3xl font-semibold tabular-nums">{summary?.total ?? tasks.length}</p>
</div>
<div>
<p className="text-sm text-gray-500">Backend avg</p>
<p className="mt-1 text-3xl font-semibold tabular-nums">{summary?.avg_progress ?? overall}%</p>
</div>
</div>
</section>


{/* Task list */}
<section className="space-y-4">
{loading && (
<div className="rounded-2xl border p-6 text-center text-gray-600">Loading…</div>
)}
{error && (
<div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
)}
{!loading && !tasks.length && !error && <EmptyState />}
{tasks.map((task) => (
<TaskCard key={task.id} task={task} onUpdated={onTaskUpdated} />)
)}
</section>
</div>
);
}
