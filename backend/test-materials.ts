/// <reference types="node" />
import fs from 'fs';
import path from 'path';

const API_URL = 'http://localhost:5000/api/v1';

async function runTests() {
  console.log('--- Memulai Skenario Tes CRUD Materi ---');
  let token = '';
  let userId = '';
  let groupId = '';
  let materialId = '';
  let cookieHeader = '';

  const testUser = {
    username: `testuser_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: 'password123',
    fullName: 'Test User',
  };

  try {
    console.log('\n[1] Mendaftarkan pengguna baru & Login...');
    const regRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    if (!regRes.ok) throw new Error(await regRes.text());
    
    const regData = await regRes.json();
    token = regData.data.token;
    userId = regData.data.id;
    const setCookie = regRes.headers.get('set-cookie');
    if (setCookie) cookieHeader = setCookie.split(';')[0]; // simple extraction
    console.log(`✅ Berhasil login sebagai: ${testUser.username}`);

    console.log('\n[2] Membuat Grup Studi baru...');
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    let subject = await prisma.subject.findFirst();
    if (!subject) {
      subject = await prisma.subject.create({
        data: { code: 'TEST101', name: 'Mata Kuliah Tes' }
      });
    }
    const subjectId = subject.id;
    await prisma.$disconnect();
    
    const groupRes = await fetch(`${API_URL}/groups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookieHeader, 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        name: 'Grup Tes Materi',
        description: 'Grup untuk mengetes fitur materi',
        subjectId: subjectId,
        maxMembers: 10
      })
    });
    if (!groupRes.ok) throw new Error(await groupRes.text());
    const groupData = await groupRes.json();
    groupId = groupData.data.id;
    console.log(`✅ Grup berhasil dibuat dengan ID: ${groupId}`);

    console.log('\n[3] Mengunggah Materi (File)...');
    const dummyFilePath = path.join(__dirname, 'dummy_test_file.pdf');
    fs.writeFileSync(dummyFilePath, 'Ini adalah file PDF tes sementara untuk materi.');

    const formData = new FormData();
    formData.append('title', 'Materi Ujian');
    formData.append('description', 'Bahan bacaan');
    
    // In Node 18+, we can use Blob for FormData file uploads
    const fileBuffer = fs.readFileSync(dummyFilePath);
    const fileBlob = new Blob([fileBuffer], { type: 'application/pdf' });
    formData.append('file', fileBlob, 'dummy_test_file.pdf');

    const uploadRes = await fetch(`${API_URL}/groups/${groupId}/materials`, {
      method: 'POST',
      headers: { 'Cookie': cookieHeader, 'Authorization': `Bearer ${token}` },
      body: formData
    });
    if (!uploadRes.ok) throw new Error(await uploadRes.text());
    const uploadData = await uploadRes.json();
    materialId = uploadData.data.id;
    console.log(`✅ Materi berhasil diunggah dengan ID: ${materialId}`);

    fs.unlinkSync(dummyFilePath);

    console.log('\n[4] Membaca Daftar Materi dan Memeriksa Otorisasi...');
    const getRes = await fetch(`${API_URL}/groups/${groupId}/materials`, {
      headers: { 'Cookie': cookieHeader, 'Authorization': `Bearer ${token}` }
    });
    const getData = await getRes.json();
    const materials = getData.data;
    const uploadedMaterial = materials.find((m: any) => m.id === materialId);
    console.log(`   - Ditemukan: ${uploadedMaterial.title}`);
    console.log(`   - ID Pengunggah (uploaderId): ${uploadedMaterial.uploaderId}`);
    
    if (uploadedMaterial.uploaderId !== userId) {
      throw new Error(`Otorisasi gagal! ID pengunggah tidak cocok dengan ID pengguna saat ini.`);
    } else {
      console.log('✅ Otorisasi berhasil (Backend mengirimkan ID pengguna yang benar ke Frontend).');
    }

    console.log('\n[5] Menghapus Materi...');
    const delRes = await fetch(`${API_URL}/materials/${materialId}`, {
      method: 'DELETE',
      headers: { 'Cookie': cookieHeader, 'Authorization': `Bearer ${token}` }
    });
    if (!delRes.ok) throw new Error(await delRes.text());
    console.log('✅ Materi berhasil dihapus!');

    const verifyRes = await fetch(`${API_URL}/groups/${groupId}/materials`, {
      headers: { 'Cookie': cookieHeader, 'Authorization': `Bearer ${token}` }
    });
    const verifyData = await verifyRes.json();
    if (verifyData.data.some((m: any) => m.id === materialId)) {
      throw new Error('Materi masih ada di dalam daftar setelah perintah hapus.');
    }
    console.log('✅ Verifikasi penghapusan berhasil (Materi benar-benar hilang dari grup).');

    console.log('\n🎉 SEMUA TES BERHASIL! FITUR MATERI BEKERJA DENGAN SEMPURNA.');

  } catch (error: any) {
    console.error('\n❌ TES GAGAL:');
    console.error(error.message || error);
  }
}

runTests();
