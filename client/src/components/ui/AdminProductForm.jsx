'use client';

import { useState, useEffect } from 'react';
import { Input, Button, Card } from './UI';

export default function AdminProductForm({ book, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    authors: '',
    isbn10: '',
    isbn13: '',
    publisher: '',
    publicationDate: '',
    description: '',
    genre: '',
    tags: '',
    authorBio: '',
    edition: '',
    ...book,
  });

  const [errors, setErrors] = useState({});
  const [formatOptions, setFormatOptions] = useState(book?.formatOptions || []);

  useEffect(() => {
    if (book) {
      setFormData({
        ...book,
        authors: Array.isArray(book.authors) ? book.authors.join(', ') : book.authors || '',
        tags: Array.isArray(book.tags) ? book.tags.join(', ') : book.tags || '',
      });
      setFormatOptions(book.formatOptions || []);
    }
  }, [book]);

  const validate = () => {
    const newErrors = {};
    
    if (formData.isbn13 && !/^978-[\d-]+$/.test(formData.isbn13) && !/^[\d-]+$/.test(formData.isbn13)) {
      newErrors.isbn13 = 'Invalid ISBN-13 format';
    }
    
    formatOptions.forEach((format, idx) => {
      if (format.price && (isNaN(format.price) || format.price < 0)) {
        newErrors[`format_${idx}_price`] = 'Price must be a positive number';
      }
      if (format.stock !== null && format.stock !== '' && (isNaN(format.stock) || format.stock < 0)) {
        newErrors[`format_${idx}_stock`] = 'Stock must be a non-negative number';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      ...formData,
      authors: formData.authors.split(',').map(a => a.trim()).filter(Boolean),
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      formatOptions,
    };

    onSave(data);
  };

  const updateFormatOption = (index, field, value) => {
    const updated = [...formatOptions];
    updated[index] = { ...updated[index], [field]: value };
    setFormatOptions(updated);
  };

  const addFormatOption = () => {
    setFormatOptions([
      ...formatOptions,
      { format: '', sku: '', price: '', listPrice: '', stock: null, pageCount: '', isDigital: false },
    ]);
  };

  const removeFormatOption = (index) => {
    setFormatOptions(formatOptions.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">Required Fields</h3>
        
        <Input
          label="Title *"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={!formData.title ? 'Title is required' : ''}
          required
        />
        
        <Input
          label="Authors *"
          value={formData.authors}
          onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
          placeholder="Comma-separated"
          error={!formData.authors ? 'At least one author is required' : ''}
          required
        />
        
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="ISBN-10"
            value={formData.isbn10}
            onChange={(e) => setFormData({ ...formData, isbn10: e.target.value })}
          />
          <Input
            label="ISBN-13"
            value={formData.isbn13}
            onChange={(e) => setFormData({ ...formData, isbn13: e.target.value })}
            error={errors.isbn13}
          />
        </div>
      </div>

      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-semibold text-primary">Optional Fields</h3>
        
        <Input
          label="Subtitle"
          value={formData.subtitle}
          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
        />
        
        <Input
          label="Publisher"
          value={formData.publisher}
          onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
        />
        
        <Input
          label="Publication Date"
          type="date"
          value={formData.publicationDate}
          onChange={(e) => setFormData({ ...formData, publicationDate: e.target.value })}
        />
        
        <div>
          <label className="block text-sm font-medium text-muted mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            rows={4}
          />
        </div>
        
        <Input
          label="Genre"
          value={formData.genre}
          onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
        />
        
        <Input
          label="Tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="Comma-separated"
        />
        
        <div>
          <label className="block text-sm font-medium text-muted mb-1">Author Bio</label>
          <textarea
            value={formData.authorBio}
            onChange={(e) => setFormData({ ...formData, authorBio: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            rows={3}
          />
        </div>
        
        <Input
          label="Edition"
          value={formData.edition}
          onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
        />
      </div>

      <div className="space-y-4 border-t pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary">Format Options</h3>
          <Button type="button" size="sm" onClick={addFormatOption}>
            Add Format
          </Button>
        </div>
        
        {formatOptions.map((format, idx) => (
          <div key={idx} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Format {idx + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFormatOption(idx)}
              >
                Remove
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Format"
                value={format.format}
                onChange={(e) => updateFormatOption(idx, 'format', e.target.value)}
                placeholder="e.g., Paperback"
              />
              <Input
                label="SKU"
                value={format.sku}
                onChange={(e) => updateFormatOption(idx, 'sku', e.target.value)}
              />
              <Input
                label="Price"
                type="number"
                step="0.01"
                value={format.price}
                onChange={(e) => updateFormatOption(idx, 'price', parseFloat(e.target.value) || '')}
                error={errors[`format_${idx}_price`]}
              />
              <Input
                label="List Price"
                type="number"
                step="0.01"
                value={format.listPrice}
                onChange={(e) => updateFormatOption(idx, 'listPrice', parseFloat(e.target.value) || '')}
              />
              <Input
                label="Stock"
                type="number"
                value={format.stock === null ? '' : format.stock}
                onChange={(e) => updateFormatOption(idx, 'stock', e.target.value === '' ? null : parseInt(e.target.value))}
                error={errors[`format_${idx}_stock`]}
                placeholder="Leave empty for unlimited"
              />
              <Input
                label="Page Count"
                type="number"
                value={format.pageCount}
                onChange={(e) => updateFormatOption(idx, 'pageCount', parseInt(e.target.value) || '')}
              />
            </div>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={format.isDigital || false}
                onChange={(e) => updateFormatOption(idx, 'isDigital', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-muted">Digital Format</span>
            </label>
          </div>
        ))}
      </div>

      <div className="flex gap-4 pt-4 border-t">
        <Button type="submit" variant="primary" className="flex-1">
          Save Changes
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}


