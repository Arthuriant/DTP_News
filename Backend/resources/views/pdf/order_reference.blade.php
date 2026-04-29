<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Lembar Kerja Mahakarya #{{ substr($id_transaksi, 0, 8) }}</title>
    <style>
        /* Reset & Base Style */
        @page { margin: 0; }
        body { 
            font-family: 'Helvetica', 'Arial', sans-serif; 
            color: #2D1A11; 
            background-color: #FFFDF5; 
            margin: 0; 
            padding: 40px; 
            line-height: 1.4;
        }

        /* Header Lembar Kerja */
        .header { 
            border-bottom: 2px solid #D9B35A; 
            padding-bottom: 10px; 
            margin-bottom: 30px; 
            text-align: center; 
        }
        .title { 
            font-size: 26px; 
            text-transform: uppercase; 
            letter-spacing: 3px; 
            margin: 0; 
            color: #2D1A11;
        }
        .subtitle { 
            font-size: 10px; 
            color: #8B7355; 
            text-transform: uppercase; 
            letter-spacing: 1px;
            margin-top: 5px;
        }
        
        /* Section styling */
        .section-title { 
            font-size: 13px; 
            font-weight: bold; 
            color: #D9B35A; 
            text-transform: uppercase; 
            border-left: 4px solid #D9B35A; 
            padding-left: 10px; 
            margin: 25px 0 15px 0; 
            letter-spacing: 1px;
        }
        
        /* Grid Informasi */
        .info-table { width: 100%; margin-bottom: 20px; font-size: 11px; border-collapse: collapse; }
        .info-table td { padding: 6px 0; vertical-align: top; }
        .label { color: #8B7355; font-weight: bold; width: 120px; text-transform: uppercase; font-size: 9px; }
        .value { color: #2D1A11; font-weight: bold; }

        /* Grid Visualisasi 3 Sisi */
        .preview-grid { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .preview-grid td { width: 33.33%; padding: 5px; text-align: center; vertical-align: top; }
        
        /* Wadah Box per Sisi */
        .preview-box { 
            background: #2D1A11; 
            padding: 12px; 
            border-radius: 8px; 
            text-align: center; 
            border: 1px solid #D9B35A; 
        }
        
        /* Canvas Perakitan Gambar (Absolute Stack) */
        .canvas-container {
            position: relative; 
            width: 100%; 
            height: 150px; /* Tinggi wajib ditentukan untuk DomPDF */
            background-color: #FFFDF5; 
            border-radius: 4px;
            margin-bottom: 10px;
            overflow: hidden;
        }
        
        /* Layer Gambar */
        .layer-img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 150px;
            object-fit: contain;
        }

        .preview-label { 
            color: #D9B35A; 
            font-size: 9px; 
            text-transform: uppercase; 
            font-weight: bold; 
            letter-spacing: 1.5px; 
            display: block;
        }

        /* Tabel Anatomi & Material */
        table.anatomy { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 10px; }
        table.anatomy th { 
            background: #2D1A11; 
            color: #D9B35A; 
            padding: 12px 10px; 
            text-transform: uppercase; 
            text-align: left; 
            letter-spacing: 1px;
        }
        table.anatomy td { padding: 12px 10px; border-bottom: 1px solid #E5D7C1; vertical-align: top; }
        .code { font-family: 'Courier', monospace; color: #8B7355; font-size: 9px; display: block; margin-top: 4px; }
        .texture-badge { 
            background: #F8F3E9; 
            border: 1px solid #D9B35A; 
            padding: 3px 8px; 
            border-radius: 3px; 
            font-weight: bold; 
            color: #D9B35A; 
            display: inline-block;
            text-transform: uppercase;
            font-size: 9px;
        }

        .footer-note {
            margin-top: 40px;
            padding-top: 15px;
            border-top: 1px solid #E5D7C1;
            text-align: right;
            font-size: 9px;
            color: #8B7355;
            font-style: italic;
        }
    </style>
</head>
<body>

    <div class="header">
        <h1 class="title">Lembar Kerja Mahakarya</h1>
        <div class="subtitle">Instruksi Kerja Produksi Bengkel Kustom</div>
    </div>

    <div class="section-title">Informasi Transaksi</div>
    <table class="info-table">
        <tr>
            <td class="label">ID Transaksi</td>
            <td class="value">: {{ $id_transaksi }}</td>
            <td class="label">Customer</td>
            <td class="value">: {{ $customer }}</td>
        </tr>
        <tr>
            <td class="label">Produk Utama</td>
            <td class="value">: {{ $produk }}</td>
            <td class="label">Tanggal Masuk</td>
            <td class="value">: {{ $tanggal_masuk }}</td>
        </tr>
        <tr>
            <td class="label">Ukuran Pilihan</td>
            <td class="value" colspan="3">: {{ $detail_material['size'] ?? '-' }}</td>
        </tr>
    </table>

    <div class="section-title">Visualisasi Desain 3 Sisi</div>
    <table class="preview-grid">
        <tr>
            <td>
                <div class="preview-box">
                    <div class="canvas-container">
                        @forelse($layers_front as $layer)
                            <img src="{{ $layer['image'] }}" class="layer-img" style="z-index: {{ $layer['z_index'] }};">
                        @empty
                            <div style="padding-top: 65px; font-size: 9px; color: #8B7355;">Blueprint Depan Kosong</div>
                        @endforelse
                    </div>
                    <span class="preview-label">Tampak Depan</span>
                </div>
            </td>
            
            <td>
                <div class="preview-box">
                    <div class="canvas-container">
                        @forelse($layers_top as $layer)
                            <img src="{{ $layer['image'] }}" class="layer-img" style="z-index: {{ $layer['z_index'] }};">
                        @empty
                            <div style="padding-top: 65px; font-size: 9px; color: #8B7355;">Blueprint Atas Kosong</div>
                        @endforelse
                    </div>
                    <span class="preview-label">Tampak Atas</span>
                </div>
            </td>

            <td>
                <div class="preview-box">
                    <div class="canvas-container">
                        @forelse($layers_back as $layer)
                            <img src="{{ $layer['image'] }}" class="layer-img" style="z-index: {{ $layer['z_index'] }};">
                        @empty
                            <div style="padding-top: 65px; font-size: 9px; color: #8B7355;">Blueprint Belakang Kosong</div>
                        @endforelse
                    </div>
                    <span class="preview-label">Tampak Belakang</span>
                </div>
            </td>
        </tr>
    </table>

    <div class="section-title">Anatomi & Spesifikasi Material</div>
    <table class="anatomy">
        <thead>
            <tr>
                <th style="width: 35%;">Komponen Bagian</th>
                <th style="width: 30%;">Varian Bentuk</th>
                <th style="width: 35%;">Material / Tekstur</th>
            </tr>
        </thead>
        <tbody>
            @if(isset($detail_material['parts']))
                @foreach($detail_material['parts'] as $part)
                    <tr>
                        <td>
                            <div style="font-weight: bold; font-size: 11px;">{{ $part['name'] }}</div>
                            <span class="code">{{ $part['part_code'] ?? 'N/A' }}</span>
                        </td>
                        <td>
                            @php $variant = $part['variants'][0] ?? null; @endphp
                            {{ $variant['name'] ?? 'Standar' }}
                            <span class="code">{{ $variant['variant_code'] ?? 'N/A' }}</span>
                        </td>
                        <td>
                            @php $texture = $variant['textures'][0] ?? null; @endphp
                            @if($texture)
                                <span class="texture-badge">{{ $texture['name'] }}</span>
                                <span class="code" style="color: #D9B35A;">{{ $texture['texture_code'] ?? 'N/A' }}</span>
                            @else
                                -
                            @endif
                        </td>
                    </tr>
                @endforeach
            @else
                <tr>
                    <td colspan="3" style="text-align: center; padding: 30px; color: #8B7355;">
                        Data konfigurasi material tidak ditemukan.
                    </td>
                </tr>
            @endif
        </tbody>
    </table>

    <div class="footer-note">
        <p>Dokumen ini diterbitkan secara otomatis oleh sistem sebagai referensi sah instruksi produksi bengkel.</p>
        <p>Waktu Cetak: {{ date('d/m/Y H:i:s') }}</p>
    </div>

</body>
</html>