'use server';
import Papa from 'papaparse';

export async function parseCSVAction(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    
    if (!file) {
      return { error: 'No file selected' };
    }
    
    if (!file.name.match(/\.csv$/i)) {
      return { error: 'Please upload CSV file only' };
    }

    console.log('File received:', file.name, file.size); // ✅ Server logs

    const text = await file.text();
    console.log('File text length:', text.length); // ✅ Debug

    const result = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
    });

    console.log('PapaParse result:', result.data.length, 'rows'); // ✅ Server logs

    if (result.errors.length > 0) {
      console.log('Parse errors:', result.errors);
      return { error: `CSV parse error: ${result.errors[0].message}` };
    }

    const medicines = result.data
      .map((row: any) => ({
        name: row.name?.toString().trim() || '',
        dosageType: row.dosageType?.toString().trim() || row['dosage_type']?.toString().trim() || '',
        generic: row.generic?.toString().trim() || row['generic_name']?.toString().trim() || '',
        strength: row.strength?.toString().trim() || '',
        manufacturer: row.manufacturer?.toString().trim() || row.company?.toString().trim() || '',
        UnitPrice: row.UnitPrice?.toString().trim() || row['unit_price']?.toString().trim() || '0',
        PackageSize: row.PackageSize?.toString().trim() || row['package_size']?.toString().trim() || '',
      }))
      .filter(row => row.name.length > 0);

    console.log('Final medicines:', medicines.length); // ✅ Server logs

    return { 
      medicines,
      total: medicines.length 
    };
  } catch (error) {
    console.error('Server Action Error:', error);
    return { error: 'Server error processing file' };
  }
}
