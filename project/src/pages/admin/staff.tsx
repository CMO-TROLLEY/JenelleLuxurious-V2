import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, UserPlus, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { fetchAllStaff, fetchStaffSchedules, fetchCatalogue, buildAllCategories } from '@/lib/catalogue';
import { useSEO } from '@/hooks/use-seo';
import { AdminLayout } from '@/components/admin-layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import type { Staff, StaffSchedule, CategoryWithServices } from '@/types';
import { cn } from '@/lib/utils';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function AdminStaff() {
  useSEO({ title: 'Staff & Schedule | Jenelle Luxurious Admin', noindex: true });

  const [staff, setStaff] = useState<Staff[]>([]);
  const [schedules, setSchedules] = useState<StaffSchedule[]>([]);
  const [categories, setCategories] = useState<CategoryWithServices[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');

  const load = async () => {
    const [s, sch, c] = await Promise.all([fetchAllStaff(), fetchStaffSchedules(), fetchCatalogue()]);
    setStaff(s); setSchedules(sch);
    if (c) setCategories(buildAllCategories(c));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const addStaff = async () => {
    if (!newName) return;
    await supabase.from('staff').insert({ name: newName, role: newRole || null, display_order: staff.length });
    setShowAddStaff(false); setNewName(''); setNewRole('');
    load();
  };

  const updateStaff = async (id: string, field: string, value: string | boolean) => {
    await supabase.from('staff').update({ [field]: value }).eq('id', id);
    load();
  };

  const deleteStaff = async (id: string) => {
    await supabase.from('staff').delete().eq('id', id);
    if (selectedStaff === id) setSelectedStaff(null);
    load();
  };

  const updateSchedule = async (staffId: string, dayOfWeek: number, field: 'start_time' | 'end_time' | 'is_working', value: string | boolean) => {
    const existing = schedules.find((s) => s.staff_id === staffId && s.day_of_week === dayOfWeek);
    if (existing) {
      await supabase.from('staff_schedules').update({ [field]: value }).eq('id', existing.id);
    } else {
      await supabase.from('staff_schedules').insert({ staff_id: staffId, day_of_week: dayOfWeek, start_time: '09:00', end_time: '17:00', is_working: field === 'is_working' ? value : true });
    }
    load();
  };

  const selectedStaffMember = staff.find((s) => s.id === selectedStaff);

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="font-serif text-2xl font-semibold text-plum">Staff & Schedule</h1><p className="text-sm text-muted-foreground">Manage staff members and their weekly schedules.</p></div>
        <Button onClick={() => setShowAddStaff(true)} className="rounded-full bg-primary hover:bg-primary/90"><UserPlus className="h-4 w-4" />Add Staff</Button>
      </div>

      {loading ? <div className="flex h-64 items-center justify-center"><div className="h-12 w-12 animate-spin rounded-full border-4 border-secondary border-t-primary" /></div> : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
          {/* Staff list */}
          <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-card">
            <h2 className="mb-3 font-serif text-base font-semibold text-plum">Staff Members</h2>
            {staff.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">No staff yet. Add your first team member.</p> : (
              <div className="space-y-2">
                {staff.map((member) => (
                  <div key={member.id} className={cn('flex items-center justify-between rounded-xl border p-3 transition-all', selectedStaff === member.id ? 'border-rose/30 bg-secondary shadow-soft' : 'border-border/60 hover:bg-secondary/40')}>
                    <button onClick={() => setSelectedStaff(member.id)} className="flex-1 text-left">
                      <p className="text-sm font-medium text-plum">{member.name}</p>
                      {member.role && <p className="text-xs text-muted-foreground">{member.role}</p>}
                    </button>
                    <button onClick={() => deleteStaff(member.id)} className="rounded p-1 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Schedule editor */}
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
            {selectedStaffMember ? (
              <>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary"><Clock className="h-5 w-5 text-rose" /></div>
                  <div className="flex-1"><Input defaultValue={selectedStaffMember.name} onBlur={(e) => updateStaff(selectedStaffMember.id, 'name', e.target.value)} className="font-serif text-lg font-semibold" /></div>
                  <div className="flex items-center gap-2"><Label className="text-xs text-muted-foreground">Active</Label><Switch checked={selectedStaffMember.is_active} onCheckedChange={(v) => updateStaff(selectedStaffMember.id, 'is_active', v)} /></div>
                </div>
                <Input defaultValue={selectedStaffMember.role ?? ''} placeholder="Role (e.g. Massage Therapist)" onBlur={(e) => updateStaff(selectedStaffMember.id, 'role', e.target.value)} className="mb-4" />

                <h3 className="mb-3 text-sm font-semibold text-plum">Weekly Schedule</h3>
                <div className="space-y-2">
                  {DAYS.map((day, idx) => {
                    const schedule = schedules.find((s) => s.staff_id === selectedStaffMember.id && s.day_of_week === idx);
                    const isWorking = schedule?.is_working ?? false;
                    return (
                      <div key={day} className="flex items-center gap-3 rounded-xl bg-secondary/20 p-3">
                        <div className="w-24"><span className="text-sm font-medium text-plum">{day}</span></div>
                        <Switch checked={isWorking} onCheckedChange={(v) => updateSchedule(selectedStaffMember.id, idx, 'is_working', v)} />
                        {isWorking && (
                          <div className="flex items-center gap-2">
                            <Input type="time" defaultValue={schedule?.start_time ?? '09:00'} className="w-28" onChange={(e) => updateSchedule(selectedStaffMember.id, idx, 'start_time', e.target.value)} />
                            <span className="text-xs text-muted-foreground">to</span>
                            <Input type="time" defaultValue={schedule?.end_time ?? '17:00'} className="w-28" onChange={(e) => updateSchedule(selectedStaffMember.id, idx, 'end_time', e.target.value)} />
                          </div>
                        )}
                        {!isWorking && <span className="text-xs text-muted-foreground">Day off</span>}
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center text-center">
                <Clock className="mb-3 h-12 w-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Select a staff member to edit their schedule.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {showAddStaff && (
        <>
          <div className="fixed inset-0 z-50 bg-plum/40 backdrop-blur-sm" onClick={() => setShowAddStaff(false)} />
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-card p-6 shadow-card sm:inset-x-auto sm:left-1/2 sm:top-1/2 sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl">
            <h2 className="mb-4 font-serif text-xl font-semibold text-plum">Add Staff Member</h2>
            <div className="space-y-3">
              <div><Label>Name</Label><Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Thandi Dlamini" /></div>
              <div><Label>Role</Label><Input value={newRole} onChange={(e) => setNewRole(e.target.value)} placeholder="e.g. Massage Therapist" /></div>
              <div className="flex gap-3 pt-2"><Button variant="outline" className="flex-1 rounded-full" onClick={() => setShowAddStaff(false)}>Cancel</Button><Button className="flex-1 rounded-full bg-primary" onClick={addStaff}><Plus className="h-4 w-4" />Add</Button></div>
            </div>
          </motion.div>
        </>
      )}
    </AdminLayout>
  );
}
