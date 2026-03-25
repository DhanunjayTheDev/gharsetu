import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import { Input, Select, Textarea, Button, Card } from '@/components/ui';
import { useCreateProperty } from '@/hooks';

const CreatePropertyPage: React.FC = () => {
  const navigate = useNavigate();
  const create = useCreateProperty();

  const [form, setForm] = useState({
    title: '', description: '', type: 'apartment', purpose: 'sale',
    price: '', area: '', bedrooms: '', bathrooms: '', floor: '',
    totalFloors: '', yearBuilt: '', furnishing: 'unfurnished',
    street: '', city: '', state: '', pincode: '', amenities: '',
  });
  const [images, setImages] = useState<File[]>([]);

  const update = (field: string, value: string) => setForm({ ...form, [field]: value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('type', form.type);
    formData.append('purpose', form.purpose);
    formData.append('price', form.price);
    if (form.area) formData.append('area', form.area);
    if (form.bedrooms) formData.append('bedrooms', form.bedrooms);
    if (form.bathrooms) formData.append('bathrooms', form.bathrooms);
    if (form.floor) formData.append('floor', form.floor);
    if (form.totalFloors) formData.append('totalFloors', form.totalFloors);
    if (form.yearBuilt) formData.append('yearBuilt', form.yearBuilt);
    formData.append('furnishing', form.furnishing);
    formData.append('address[street]', form.street);
    formData.append('address[city]', form.city);
    formData.append('address[state]', form.state);
    formData.append('address[pincode]', form.pincode);
    if (form.amenities) {
      form.amenities.split(',').map(a => a.trim()).filter(Boolean).forEach(a => {
        formData.append('amenities[]', a);
      });
    }
    images.forEach(img => formData.append('images', img));
    create.mutate(formData, { onSuccess: () => navigate('/properties') });
  };

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImages(Array.from(e.target.files).slice(0, 10));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">List a Property</h1>
            <p className="text-gray-500 text-sm">Fill in the details to create a new listing</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <Input label="Property Title" placeholder="e.g., Spacious 3BHK in Bandra" required value={form.title} onChange={(e) => update('title', e.target.value)} />
              <Textarea label="Description" rows={4} placeholder="Describe the property..." required value={form.description} onChange={(e) => update('description', e.target.value)} />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Select label="Type" required value={form.type} onChange={(e) => update('type', e.target.value)}
                  options={[{value:'apartment',label:'Apartment'},{value:'house',label:'House'},{value:'villa',label:'Villa'},{value:'plot',label:'Plot'},{value:'commercial',label:'Commercial'},{value:'farmhouse',label:'Farmhouse'},{value:'penthouse',label:'Penthouse'},{value:'office',label:'Office'},{value:'shop',label:'Shop'},{value:'warehouse',label:'Warehouse'}]} placeholder="Select type" />
                <Select label="Purpose" required value={form.purpose} onChange={(e) => update('purpose', e.target.value)}
                  options={[{value:'sale',label:'Sale'},{value:'rent',label:'Rent'},{value:'lease',label:'Lease'}]} placeholder="Select purpose" />
                <Select label="Furnishing" value={form.furnishing} onChange={(e) => update('furnishing', e.target.value)}
                  options={[{value:'unfurnished',label:'Unfurnished'},{value:'semi-furnished',label:'Semi-Furnished'},{value:'fully-furnished',label:'Fully-Furnished'}]} placeholder="Select furnishing" />
              </div>
              <Input label={`Price (${form.purpose === 'rent' ? '/month' : 'Total'})`} type="number" placeholder="e.g., 5000000" required value={form.price} onChange={(e) => update('price', e.target.value)} />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Property Details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Input label="Area (sq. ft.)" type="number" value={form.area} onChange={(e) => update('area', e.target.value)} />
              <Input label="Bedrooms" type="number" value={form.bedrooms} onChange={(e) => update('bedrooms', e.target.value)} />
              <Input label="Bathrooms" type="number" value={form.bathrooms} onChange={(e) => update('bathrooms', e.target.value)} />
              <Input label="Floor" type="number" value={form.floor} onChange={(e) => update('floor', e.target.value)} />
              <Input label="Total Floors" type="number" value={form.totalFloors} onChange={(e) => update('totalFloors', e.target.value)} />
              <Input label="Year Built" type="number" value={form.yearBuilt} onChange={(e) => update('yearBuilt', e.target.value)} />
            </div>
            <div className="mt-4">
              <Input label="Amenities (comma separated)" placeholder="Parking, Gym, Pool" value={form.amenities} onChange={(e) => update('amenities', e.target.value)} />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Address</h2>
            <div className="space-y-4">
              <Input label="Street Address" value={form.street} onChange={(e) => update('street', e.target.value)} />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Input label="City" required value={form.city} onChange={(e) => update('city', e.target.value)} />
                <Input label="State" required value={form.state} onChange={(e) => update('state', e.target.value)} />
                <Input label="Pincode" required value={form.pincode} onChange={(e) => update('pincode', e.target.value)} />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Images</h2>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
              <input type="file" multiple accept="image/*" onChange={handleImages} className="hidden" id="images" />
              <label htmlFor="images" className="cursor-pointer">
                <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Click to upload images (max 10)</p>
              </label>
              {images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                  {images.map((img, i) => (
                    <div key={i} className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                      <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" type="button" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit" loading={create.isPending}>Publish Property</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreatePropertyPage;
