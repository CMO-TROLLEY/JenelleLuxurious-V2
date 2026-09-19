import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { fetchCatalogue, buildAllCategories, formatPrice, formatDuration } from '@/lib/catalogue';
import { useSEO } from '@/hooks/use-seo';
import { AdminLayout } from '@/components/admin-layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { CategoryWithServices, ServiceVariant } from '@/types';

export function AdminServices() {
  useSEO({ title: 'Services Manager | Jenelle Luxurious Admin', noindex: true });

  const [categories, setCategories] = useState<CategoryWithServices[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<string | null>(null);
  const [showAddService, setShowAddService] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState('');

  const load = () => {
    fetchCatalogue().then((data) => { if (data) setCategories(buildAllCategories(data)); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const updateVariant = async (variant: ServiceVariant, field: keyof ServiceVariant, value: string | number | boolean) => {
    await supabase.from('service_variants').update({ [field]: value }).eq('id', variant.id);
    load();
  };

  const addVariant = async (serviceId: string) => {
    await supabase.from('service_variants').insert({ service_id: serviceId, label: 'New Option', duration_minutes: 60, price: 0, display_order: 99 });
    load();
  };

  const deleteVariant = async (variantId: string) => {
    await supabase.from('service_variants').delete().eq('id', variantId);
    load();
  };

  const updateService = async (serviceId: string, field: string, value: string) => {
    await supabase.from('services').update({ [field]: value }).eq('id', serviceId);
    load();
  };

  const addService = async () => {
    if (!newServiceName || !newServiceCategory) return;
    const slug = newServiceName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const { data } = await supabase.from('services').insert({ category_id: newServiceCategory, name: newServiceName, slug, display_order: 99 }).select('id').single();
    if (data) {
      const price = parseInt(newServicePrice) || 0;
      const duration = parseInt(newServiceDuration) || 60;
      await supabase.from('service_variants').insert({ service_id: data.id, label: formatDuration(duration), duration_minutes: duration, price, display_order: 1 });
    }
    setShowAddService(false); setNewServiceName(''); setNewServiceCategory(''); setNewServicePrice(''); setNewServiceDuration('');
    load();
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="font-serif text-2xl font-semibold text-plum">Services Manager</h1><p className="text-sm text-muted-foreground">Manage treatments, prices, and durations.</p></div>
        <Button onClick={() => setShowAddService(true)} className="rounded-full bg-primary hover:bg-primary/90"><Plus className="h-4 w-4" />Add Service</Button>
      </div>

      {loading ? <div className="flex h-64 items-center justify-center"><div className="h-12 w-12 animate-spin rounded-full border-4 border-secondary border-t-primary" /></div> : (
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category.id} className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
              <h2 className="mb-4 font-serif text-lg font-semibold text-plum">{category.name}</h2>
              <div className="space-y-3">
                {category.services.map((service) => (
                  <div key={service.id} className="rounded-xl border border-border/60 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1"><p className="font-medium text-plum">{service.name}</p>{service.description && <p className="text-xs text-muted-foreground line-clamp-1">{service.description}</p>}</div>
                      <button onClick={() => setEditingService(editingService === service.id ? null : service.id)} className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-primary"><Pencil className="h-4 w-4" /></button>
                    </div>

                    {editingService === service.id && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 space-y-3 border-t border-border/60 pt-4">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div><Label className="text-xs">Name</Label><Input defaultValue={service.name} onBlur={(e) => updateService(service.id, 'name', e.target.value)} /></div>
                          <div><Label className="text-xs">Description</Label><Input defaultValue={service.description ?? ''} onBlur={(e) => updateService(service.id, 'description', e.target.value)} /></div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between"><Label className="text-xs">Variants</Label><button onClick={() => addVariant(service.id)} className="text-xs text-primary hover:underline">+ Add Variant</button></div>
                          {service.variants.map((variant) => (
                            <div key={variant.id} className="grid grid-cols-12 gap-2 items-center rounded-lg bg-secondary/30 p-2">
                              <Input className="col-span-4" defaultValue={variant.label} onBlur={(e) => updateVariant(variant, 'label', e.target.value)} />
                              <Input className="col-span-3" type="number" defaultValue={variant.duration_minutes} onBlur={(e) => updateVariant(variant, 'duration_minutes', parseInt(e.target.value) || 0)} />
                              <Input className="col-span-3" type="number" defaultValue={variant.price} onBlur={(e) => updateVariant(variant, 'price', parseInt(e.target.value) || 0)} />
                              <div className="col-span-1 text-center text-xs text-muted-foreground">{formatPrice(variant.price)}</div>
                              <button onClick={() => deleteVariant(variant.id)} className="col-span-1 rounded p-1 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {!editingService && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {service.variants.map((v) => <span key={v.id} className="rounded-full bg-secondary px-3 py-1 text-xs text-plum">{v.label} · {formatPrice(v.price)}</span>)}
                      </div>
                    )}
                  </div>
                ))}
                {category.services.length === 0 && <p className="text-sm text-muted-foreground">No services in this category.</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddService && (
        <>
          <div className="fixed inset-0 z-50 bg-plum/40 backdrop-blur-sm" onClick={() => setShowAddService(false)} />
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-card p-6 shadow-card sm:inset-x-auto sm:left-1/2 sm:top-1/2 sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl">
            <h2 className="mb-4 font-serif text-xl font-semibold text-plum">Add New Service</h2>
            <div className="space-y-3">
              <div><Label>Service Name</Label><Input value={newServiceName} onChange={(e) => setNewServiceName(e.target.value)} placeholder="e.g. Hot Stone Massage" /></div>
              <div><Label>Category</Label><Select value={newServiceCategory} onValueChange={setNewServiceCategory}><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
              <div className="grid grid-cols-2 gap-3"><div><Label>Price (E)</Label><Input type="number" value={newServicePrice} onChange={(e) => setNewServicePrice(e.target.value)} placeholder="550" /></div><div><Label>Duration (min)</Label><Input type="number" value={newServiceDuration} onChange={(e) => setNewServiceDuration(e.target.value)} placeholder="60" /></div></div>
              <div className="flex gap-3 pt-2"><Button variant="outline" className="flex-1 rounded-full" onClick={() => setShowAddService(false)}>Cancel</Button><Button className="flex-1 rounded-full bg-primary" onClick={addService}><Check className="h-4 w-4" />Add</Button></div>
            </div>
          </motion.div>
        </>
      )}
    </AdminLayout>
  );
}
