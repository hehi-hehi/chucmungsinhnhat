// ===== ỨNG DỤNG THIỆP SINH NHẬT =====

document.getElementById('ten-nguoi-nhan').textContent = CONFIG.tenNguoiNhan;
document.getElementById('loi-chuc').textContent       = CONFIG.loiChuc;

const elTenChuc = document.getElementById('ten-chuc-mung');
const elLoiChuc = document.getElementById('loi-chuc-lon');
if (elTenChuc) elTenChuc.textContent = CONFIG.tenNguoiNhan;
if (elLoiChuc) elLoiChuc.textContent = CONFIG.loiChuc;

document.documentElement.style.setProperty('--mau-nen-1', CONFIG.mauNen1);
document.documentElement.style.setProperty('--mau-nen-2', CONFIG.mauNen2);
document.documentElement.style.setProperty('--mau-nen-3', CONFIG.mauNen3);
document.documentElement.style.setProperty('--mau-hong',  CONFIG.mauTieuDe);

// ===== NHẠC NỀN =====
const audio = document.getElementById('nhac-nen');
let nhacDangPhat = false;

// Playlist — lấy từ config + các bài còn lại
const PLAYLIST = [
  { src: 'assets/music/happy-birthday.mp3', ten: 'Happy Birthday' },
  { src: 'assets/music/I Do.mp3',           ten: 'I Do' },
  { src: 'assets/music/Đến Khi Nào.mp3',    ten: 'Đến Khi Nào' },
  { src: 'assets/music/NƠI NÀY CÓ ANH _ OFFICIAL MUSIC VIDEO _ SƠN TÙNG M-TP - (320 Kbps).mp3', ten: 'Nơi Này Có Anh' },
].filter(b => b.src);

let baiHienTai = 0;

function layTenBai(src) {
  if (!src) return '';
  const ten = src.split('/').pop().replace(/\.mp3$/i,'').replace(/\.ogg$/i,'').replace(/\.m4a$/i,'');
  // Rút gọn tên dài
  return ten.length > 30 ? ten.substring(0, 28) + '…' : ten;
}

function taiVaPhatBai(idx) {
  baiHienTai = (idx + PLAYLIST.length) % PLAYLIST.length;
  const bai  = PLAYLIST[baiHienTai];
  audio.src  = bai.src;
  audio.load();
  audio.play()
    .then(() => { nhacDangPhat = true; capNhatGiaoDienNhac(); capNhatPlaylist(); })
    .catch(e => console.warn('[Nhạc]', e.message));
  const elTen = document.getElementById('mp-ten-bai');
  if (elTen) elTen.textContent = bai.ten;
}

// Tạo danh sách playlist trong popup
function taoDanhSachPlaylist() {
  const list = document.getElementById('mp-playlist-list');
  if (!list) return;
  list.innerHTML = '';
  PLAYLIST.forEach((bai, i) => {
    const item = document.createElement('button');
    item.className = 'mp-playlist-item' + (i === baiHienTai ? ' dang-phat' : '');
    item.innerHTML = `
      <span class="mp-playlist-item-so">${i + 1}</span>
      <span class="mp-playlist-item-ten">${bai.ten}</span>
      <span class="mp-playlist-item-icon">
        <span></span><span></span><span></span>
      </span>`;
    item.onclick = () => { taiVaPhatBai(i); dongPlaylist(); };
    list.appendChild(item);
  });
}

function capNhatPlaylist() {
  const items = document.querySelectorAll('.mp-playlist-item');
  items.forEach((el, i) => {
    el.classList.toggle('dang-phat', i === baiHienTai);
  });
}

let playlistDangMo = false;

function togglePlaylist() {
  const popup = document.getElementById('mp-playlist');
  const btn   = document.getElementById('mp-btn-icon-nhac');
  if (!popup) return;
  if (playlistDangMo) {
    dongPlaylist();
  } else {
    taoDanhSachPlaylist();
    popup.classList.add('hien');
    btn.classList.add('active');
    playlistDangMo = true;
  }
}

function dongPlaylist() {
  const popup = document.getElementById('mp-playlist');
  const btn   = document.getElementById('mp-btn-icon-nhac');
  if (popup) popup.classList.remove('hien');
  if (btn)   btn.classList.remove('active');
  playlistDangMo = false;
}

// Bấm ra ngoài player thì đóng playlist
document.addEventListener('click', function(e) {
  if (playlistDangMo && !e.target.closest('#music-player')) {
    dongPlaylist();
  }
});

function capNhatGiaoDienNhac() {
  const btnPlay  = document.getElementById('mp-btn-play');
  if (!btnPlay) return;
  const iconPlay  = btnPlay.querySelector('.mp-icon-play');
  const iconPause = btnPlay.querySelector('.mp-icon-pause');
  if (nhacDangPhat) {
    iconPlay.style.display  = 'none';
    iconPause.style.display = 'block';
  } else {
    iconPlay.style.display  = 'block';
    iconPause.style.display = 'none';
  }
}

// Giữ tên hàm cũ để tương thích
function capNhatIconNhac() { capNhatGiaoDienNhac(); }

function toggleNhac() {
  if (nhacDangPhat) {
    audio.pause();
    nhacDangPhat = false;
  } else {
    audio.play().then(() => { nhacDangPhat = true; }).catch(e => console.warn('[Nhạc]', e.message));
  }
  capNhatGiaoDienNhac();
}

function prevBai() { taiVaPhatBai(baiHienTai - 1); }
function nextBai() { taiVaPhatBai(baiHienTai + 1); }

// Tự chuyển bài khi hết
audio.addEventListener('ended', () => nextBai());

// Cập nhật thanh tiến trình
audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const pct  = (audio.currentTime / audio.duration) * 100;
  const fill = document.getElementById('mp-progress-fill');
  const dot  = document.getElementById('mp-progress-dot');
  const hien = document.getElementById('mp-time-hien');
  const tong = document.getElementById('mp-time-tong');
  if (fill) fill.style.width = pct + '%';
  if (dot)  dot.style.left  = pct + '%';
  if (hien) hien.textContent = formatTime(audio.currentTime);
  if (tong) tong.textContent = formatTime(audio.duration);
});

function formatTime(s) {
  if (isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2,'0')}`;
}

function tuaBai(e) {
  const bar  = document.getElementById('mp-progress-bar');
  const rect = bar.getBoundingClientRect();
  const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  audio.currentTime = pct * audio.duration;
}

// ===== SPLASH SCREEN =====
function vaoThiep() {
  const splash = document.getElementById('splash');
  if (splash) { splash.classList.add('an-di'); setTimeout(() => { splash.style.display = 'none'; }, 800); }
  // Tải và phát bài đầu tiên
  taiVaPhatBai(0);
}

const splashBtn = document.getElementById('splash-btn');
if (splashBtn) {
  splashBtn.addEventListener('click', vaoThiep);
  splashBtn.addEventListener('touchend', function(e) { e.preventDefault(); vaoThiep(); });
}

// ===== QUẢN LÝ MÀN HÌNH =====
let trangThai    = 'countdown';
let phaoHoaStarted = false;

const manHopQua   = document.getElementById('man-hop-qua');
const manChucMung = document.getElementById('man-chuc-mung');
const hopQua      = document.getElementById('hop-qua');

function anMan(el, callback) {
  el.style.display       = 'none';
  el.style.opacity       = '1';
  el.style.pointerEvents = 'none';
  if (callback) callback();
}

function hienMan(el, flex) {
  el.style.display       = flex ? 'flex' : 'block';
  el.style.opacity       = '1';
  el.style.pointerEvents = 'auto';
}

let hoaHopQuaStarted = false;

function hienManHopQua() {
  if (trangThai === 'hopqua') return;
  trangThai = 'hopqua';
  manHopQua.style.display       = 'flex';
  manHopQua.style.opacity       = '1';
  manHopQua.style.pointerEvents = 'auto';
  if (!hoaHopQuaStarted) {
    hoaHopQuaStarted = true;
    batHoaHopQua();
  }
}

function batHoaHopQua() {
  const canvas = document.getElementById('canvas-hoa-hopqua');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize); resize();

  const mauList = [
    'rgba(200,150,255,V)', 'rgba(220,170,255,V)',
    'rgba(180,120,240,V)', 'rgba(240,200,255,V)', 'rgba(160,100,220,V)'
  ];

  function veHoa(x, y, r, mau, alpha) {
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y);
    for (let i = 0; i < 5; i++) {
      ctx.save(); ctx.rotate((Math.PI * 2 / 5) * i);
      ctx.beginPath(); ctx.ellipse(0, -r * 0.7, r * 0.35, r * 0.6, 0, 0, Math.PI * 2);
      ctx.fillStyle = mau; ctx.fill(); ctx.restore();
    }
    ctx.beginPath(); ctx.arc(0, 0, r * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,240,255,0.9)'; ctx.fill();
    ctx.restore();
  }

  const items = [];
  for (let i = 0; i < 45; i++) {
    const loai = Math.random() < 0.5 ? 'hoa' : 'cham';
    items.push({
      loai,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: loai === 'hoa' ? Math.random() * 7 + 4 : Math.random() * 3 + 1.5,
      vy: Math.random() * 0.6 + 0.2,
      vx: (Math.random() - 0.5) * 0.4,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.02,
      alpha: Math.random() * 0.4 + 0.2,
      mau: mauList[Math.floor(Math.random() * mauList.length)],
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    items.forEach(p => {
      p.y += p.vy; p.x += p.vx; p.rot += p.vrot;
      p.x += Math.sin(p.y * 0.012 + p.rot) * 0.3;
      if (p.y > canvas.height + 15) { p.y = -15; p.x = Math.random() * canvas.width; }
      const mau = p.mau.replace('V', p.alpha);
      if (p.loai === 'hoa') {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.translate(-p.x, -p.y);
        veHoa(p.x, p.y, p.r, mau, p.alpha); ctx.restore();
      } else {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.mau.replace('V', p.alpha * 0.6); ctx.fill();
      }
    });
    requestAnimationFrame(animate);
  }
  animate();
}

function moHopQua() {
  if (hopQua.classList.contains('dang-mo')) return;
  hopQua.classList.add('dang-mo');
  taoHatBayRa(document.getElementById('hop-qua-wrap'));
  setTimeout(() => { manHopQua.style.display = 'none'; }, 300);
  hienManChucMung();
}

function hienManChucMung() {
  trangThai = 'chucmung';
  const elTen = document.getElementById('ten-special');
  if (elTen) elTen.textContent = CONFIG.tenNguoiNhan;
  manChucMung.style.display       = 'flex';
  manChucMung.style.opacity       = '1';
  manChucMung.style.pointerEvents = 'auto';
  if (!phaoHoaStarted) {
    phaoHoaStarted = true;
    batHieuUngSpecial();
  }
}

function quayLaiTrang1() {
  const manHienTai = trangThai === 'hopqua'   ? manHopQua
                   : trangThai === 'chucmung' ? manChucMung
                   : null;
  if (!manHienTai) return;
  anThu();
  trangThai = 'countdown';
  // Ẩn tất cả màn phụ
  [manHienTai, manHopQua, manChucMung].forEach(el => {
    el.style.display       = 'none';
    el.style.opacity       = '1';
    el.style.pointerEvents = 'none';
  });
  hopQua.classList.remove('dang-mo');
}

// ===== LÁ THƯ =====
const manLaThu = document.getElementById('man-la-thu');

// Nội dung lá thư — mỗi đoạn là 1 phần tử, gõ lần lượt
const NOI_DUNG_THU = [
  '🌸 Chúc mừng sinh nhật em! 🎂✨',
  'Chúc em tuổi mới luôn rạng rỡ, bình an và gặp thật nhiều điều tốt đẹp. Mong những điều em ước ao đều dần trở thành hiện thực, những ngày em mệt mỏi luôn có người ở bên sẻ chia, và mỗi chặng đường em đi qua đều ngập tràn niềm vui. Mong em luôn giữ được nụ cười trên môi, sự dịu dàng trong tim và được yêu thương theo cách em xứng đáng. 💗',
  'Mong tuổi mới sẽ dịu dàng với em hơn, mang đến cho em thật nhiều niềm vui, những cuộc gặp gỡ đáng quý và những điều bất ngờ thật đẹp. Chúc em luôn được yêu thương, trân trọng và hạnh phúc với những gì mình đang có. 💐❤️',
  'Chúc em một đời an yên, vạn điều như ý và luôn hạnh phúc nhé! 🌷',
];

let hoaThuStarted = false;

function hienThu() {
  const elTen = document.getElementById('la-thu-ten');
  if (elTen) elTen.textContent = `Gửi ${CONFIG.tenNguoiNhan},`;
  const elKy = document.getElementById('la-thu-ky');
  if (elKy) elKy.classList.remove('hien');

  hienMan(manLaThu, 'flex');

  if (!hoaThuStarted) {
    hoaThuStarted = true;
    batCanvasHoaThu();
  }

  setTimeout(() => batGochu(), 700);
}

function batCanvasHoaThu() {
  const canvas = document.getElementById('canvas-hoa-thu');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize); resize();

  const mauList = [
    'rgba(255,150,180,V)', 'rgba(255,180,200,V)',
    'rgba(240,100,150,V)', 'rgba(255,210,220,V)', 'rgba(255,130,165,V)'
  ];

  function veBongHoa(x, y, r, mau, alpha) {
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y);
    for (let i = 0; i < 5; i++) {
      ctx.save(); ctx.rotate((Math.PI * 2 / 5) * i);
      ctx.beginPath(); ctx.ellipse(0, -r * 0.7, r * 0.35, r * 0.6, 0, 0, Math.PI * 2);
      ctx.fillStyle = mau; ctx.fill(); ctx.restore();
    }
    ctx.beginPath(); ctx.arc(0, 0, r * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,240,200,0.9)'; ctx.fill();
    ctx.restore();
  }

  const items = [];
  for (let i = 0; i < 40; i++) {
    const loai = Math.random() < 0.5 ? 'hoa' : 'cham';
    items.push({
      loai,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: loai === 'hoa' ? Math.random() * 7 + 4 : Math.random() * 3 + 1.5,
      vy: Math.random() * 0.5 + 0.2,
      vx: (Math.random() - 0.5) * 0.35,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.018,
      alpha: Math.random() * 0.45 + 0.2,
      mau: mauList[Math.floor(Math.random() * mauList.length)],
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    items.forEach(p => {
      p.y += p.vy; p.x += p.vx; p.rot += p.vrot;
      p.x += Math.sin(p.y * 0.012 + p.rot) * 0.35;
      if (p.y > canvas.height + 15) { p.y = -15; p.x = Math.random() * canvas.width; }
      const mau = p.mau.replace('V', p.alpha);
      if (p.loai === 'hoa') {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.translate(-p.x, -p.y);
        veBongHoa(p.x, p.y, p.r, mau, p.alpha); ctx.restore();
      } else {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.mau.replace('V', p.alpha * 0.6); ctx.fill();
      }
    });
    requestAnimationFrame(animate);
  }
  animate();
}

function batGochu() {
  const el = document.getElementById('la-thu-van-ban');
  if (!el) return;
  el.innerHTML = '<span class="con-tro"></span>';

  let doanHienTai = 0;
  let kyTuHienTai = 0;
  let vanBanDaGo  = '';

  function goTungKyTu() {
    if (doanHienTai >= NOI_DUNG_THU.length) {
      // Xong tất cả — ẩn con trỏ, hiện chữ ký
      el.innerHTML = formatVanBan(vanBanDaGo);
      const elKy = document.getElementById('la-thu-ky');
      if (elKy) setTimeout(() => elKy.classList.add('hien'), 400);
      return;
    }

    const doan = NOI_DUNG_THU[doanHienTai];

    if (kyTuHienTai < doan.length) {
      vanBanDaGo += doan[kyTuHienTai];
      kyTuHienTai++;
      el.innerHTML = formatVanBan(vanBanDaGo) + '<span class="con-tro"></span>';
      // Tốc độ gõ: 28ms/ký tự, chậm hơn ở cuối đoạn
      const tocDo = kyTuHienTai === doan.length ? 60 : 28;
      goChuTimeout = setTimeout(goTungKyTu, tocDo);
    } else {
      // Hết đoạn → xuống dòng, sang đoạn tiếp
      vanBanDaGo += '\n\n';
      doanHienTai++;
      kyTuHienTai = 0;
      goChuTimeout = setTimeout(goTungKyTu, 350);
    }
  }

  goTungKyTu();
}

function formatVanBan(text) {
  // Chuyển \n\n thành <br><br>
  return text
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
}

function anThu() {
  if (!manLaThu) return;
  // Dừng gõ chữ nếu đang chạy
  if (goChuTimeout) { clearTimeout(goChuTimeout); goChuTimeout = null; }
  manLaThu.style.opacity      = '0';
  manLaThu.style.pointerEvents = 'none';
  setTimeout(() => { manLaThu.style.display = 'none'; }, 600);
}

// ===== HẠT LẤP LÁNH =====
(function () {
  const canvas = document.getElementById('canvas-particles');
  const ctx    = canvas.getContext('2d');
  let particles = [];
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize); resize();
  for (let i = 0; i < 120; i++) {
    particles.push({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      vy: -(Math.random() * 0.3 + 0.1), vx: (Math.random() - 0.5) * 0.2,
      alpha: Math.random(),
      dalpha: (Math.random() * 0.005 + 0.002) * (Math.random() < 0.5 ? 1 : -1),
    });
  }
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,220,240,${Math.max(0, Math.min(1, p.alpha))})`; ctx.fill();
      p.y += p.vy; p.x += p.vx; p.alpha += p.dalpha;
      if (p.alpha <= 0 || p.alpha >= 1) p.dalpha *= -1;
      if (p.y < -5) { p.y = canvas.height + 5; p.x = Math.random() * canvas.width; }
    });
    requestAnimationFrame(animate);
  }
  animate();
})();

// ===== KIỂM TRA NGÀY SINH NHẬT =====
// Nếu đúng ngày sinh nhật thì tự động vào màn chúc mừng
(function() {
  const chenh = CONFIG.ngaySinhNhat - new Date();
  if (chenh <= 0 && trangThai === 'countdown') {
    setTimeout(() => hienManChucMung(), 500);
  }
})();

// ===== HIỆU ỨNG SPECIAL DAY =====
function batHieuUngSpecial() {
  batCanvasHoa();
  batPolaroidRoi();
}

function batCanvasHoa() {
  const canvas = document.getElementById('canvas-hoa');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize); resize();

  function veBongHoa(x, y, r, mau, alpha) {
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y);
    for (let i = 0; i < 5; i++) {
      ctx.save(); ctx.rotate((Math.PI * 2 / 5) * i);
      ctx.beginPath(); ctx.ellipse(0, -r * 0.7, r * 0.38, r * 0.65, 0, 0, Math.PI * 2);
      ctx.fillStyle = mau; ctx.fill(); ctx.restore();
    }
    ctx.beginPath(); ctx.arc(0, 0, r * 0.22, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,240,200,0.9)'; ctx.fill(); ctx.restore();
  }

  const mauList = ['rgba(255,150,180,V)','rgba(255,180,200,V)','rgba(240,100,150,V)','rgba(255,200,215,V)','rgba(255,130,165,V)'];
  const items = [];
  for (let i = 0; i < 55; i++) {
    const loai = Math.random() < 0.45 ? 'hoa' : 'cham';
    items.push({
      loai, x: Math.random() * canvas.width, y: -Math.random() * canvas.height,
      r: loai === 'hoa' ? Math.random() * 9 + 5 : Math.random() * 4 + 2,
      vy: Math.random() * 0.8 + 0.3, vx: (Math.random() - 0.5) * 0.5,
      rot: Math.random() * Math.PI * 2, vrot: (Math.random() - 0.5) * 0.02,
      alpha: Math.random() * 0.5 + 0.4,
      mau: mauList[Math.floor(Math.random() * mauList.length)],
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    items.forEach(p => {
      p.y += p.vy; p.x += p.vx; p.rot += p.vrot;
      p.x += Math.sin(p.y * 0.015 + p.rot) * 0.4;
      if (p.y > canvas.height + 20) { p.y = -20; p.x = Math.random() * canvas.width; }
      const mau = p.mau.replace('V', p.alpha);
      if (p.loai === 'hoa') {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.translate(-p.x, -p.y);
        veBongHoa(p.x, p.y, p.r, mau, p.alpha); ctx.restore();
      } else {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.mau.replace('V', p.alpha * 0.7); ctx.fill();
        ctx.strokeStyle = p.mau.replace('V', p.alpha * 0.4);
        ctx.lineWidth = 0.8; ctx.stroke();
      }
    });
    requestAnimationFrame(animate);
  }
  animate();
}

function batPolaroidRoi() {
  const container = document.getElementById('polaroid-container');
  if (!container) return;
  const gradients = [
    'linear-gradient(135deg,#f9b8cc,#d97fa0)',
    'linear-gradient(135deg,#ffc8d8,#e8809e)',
    'linear-gradient(135deg,#f0a0bc,#c86888)',
    'linear-gradient(135deg,#ffd0e0,#e89ab0)',
    'linear-gradient(135deg,#f5b0c8,#d07090)',
  ];
  const anhList = CONFIG.danhSachAnh && CONFIG.danhSachAnh.length ? CONFIG.danhSachAnh : [];
  const soLuong = window.innerWidth < 600 ? 5 : 9;

  for (let i = 0; i < soLuong; i++) {
    const el  = document.createElement('div');
    el.className = 'polaroid';
    const img = document.createElement('div');
    img.className = 'polaroid-img';

    // Dùng ảnh thật nếu có, không thì dùng gradient
    if (anhList.length > 0) {
      const anhSrc = anhList[i % anhList.length];
      img.style.backgroundImage  = `url('${anhSrc}')`;
      img.style.backgroundSize   = 'cover';
      img.style.backgroundPosition = 'center';
    } else {
      img.style.background = gradients[Math.floor(Math.random() * gradients.length)];
    }

    el.appendChild(img);
    const rotStart = (Math.random() - 0.5) * 35;
    const rotEnd   = rotStart + (Math.random() - 0.5) * 25;
    const dur      = 7 + Math.random() * 8;
    const delay    = -(Math.random() * dur * 0.9);
    el.style.cssText = `
      left:${2 + Math.random() * 88}%;
      top:${Math.random() * 90 - 15}vh;
      --rot-start:${rotStart}deg;
      --rot-end:${rotEnd}deg;
      animation:roi-polaroid ${dur}s linear ${delay}s infinite;
    `;
    container.appendChild(el);
  }
}

// ===== HIỆU ỨNG TIM BAY KHI CHẠM =====
const EMOJI_TIM = ['❤️','🩷','💕','💗','💓','💖','💝','🌸'];
let _timLastTime = 0;

function _taoTim(x, y) {
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'hieu-ung-tim';
      el.textContent = EMOJI_TIM[Math.floor(Math.random() * EMOJI_TIM.length)];
      el.style.left     = (x + (Math.random() - 0.5) * 40) + 'px';
      el.style.top      = y + 'px';
      el.style.fontSize = (14 + Math.random() * 20) + 'px';
      el.style.setProperty('--dy', (-70 - Math.random() * 90) + 'px');
      el.style.setProperty('--dx', ((Math.random() - 0.5) * 70) + 'px');
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1400);
    }, i * 80);
  }
}

document.addEventListener('click', function(e) {
  // Bỏ qua nút bấm
  if (e.target.closest('#splash-btn, .nut-cho, .nut-quay-lai, .music-player, .hop-qua-wrap, .nut-doc-thu, .splash-btn')) return;
  const now = Date.now();
  if (now - _timLastTime < 120) return;
  _timLastTime = now;
  _taoTim(e.clientX, e.clientY);
});

document.addEventListener('touchend', function(e) {
  if (e.target.closest('#splash-btn, .nut-cho, .nut-quay-lai, .music-player, .hop-qua-wrap, .nut-doc-thu, .splash-btn')) return;
  const now = Date.now();
  if (now - _timLastTime < 120) return;
  _timLastTime = now;
  const t = e.changedTouches[0];
  if (t) _taoTim(t.clientX, t.clientY);
}, { passive: true });

// ===== HẠT BAY RA KHI MỞ HỘP =====
function taoHatBayRa(wrap) {
  const mauSac = ['#f8c8d4','#f5d76e','#c89ef8','#ffffff','#ffb3c6'];
  for (let i = 0; i < 24; i++) {
    const hat = document.createElement('div');
    hat.className = 'hat-bay-ra';
    const goc = (Math.PI * 2 / 24) * i;
    const d   = 80 + Math.random() * 60;
    hat.style.setProperty('--dx', `${Math.cos(goc) * d}px`);
    hat.style.setProperty('--dy', `${Math.sin(goc) * d - 30}px`);
    hat.style.background    = mauSac[Math.floor(Math.random() * mauSac.length)];
    hat.style.boxShadow     = `0 0 6px ${mauSac[Math.floor(Math.random() * mauSac.length)]}`;
    hat.style.animationDelay = `${Math.random() * 0.2}s`;
    wrap.appendChild(hat);
    setTimeout(() => hat.remove(), 1200);
  }
}
