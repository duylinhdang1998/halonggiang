import { ArrowDown, ArrowUpRight, BookOpen, Check, Globe2 } from 'lucide-react';
import ProfileExperience from '@/components/profile/ProfileExperience';
import ProfileChapter from '@/components/profile/ProfileChapter';
import { links } from '@/lib/profile';

export default function Home() {
  return <>
    <a href="#noi-dung" className="skip-link">Đến nội dung</a>
    <ProfileExperience />
    <main id="noi-dung" className="profile-story">
      <section id="gioi-thieu" className="story-section intro-section" aria-labelledby="profile-title">
        <div className="chapter-content intro-content">
          <p className="intro-eyebrow"><span />CHUYÊN GIA & GIẢNG VIÊN</p>
          <h1 id="profile-title">Hà Long<br /><span>Giang.</span></h1>
          <p className="intro-lead">Nền tảng quản trị vững chắc.<br />Tầm nhìn phát triển bền vững.</p>
          <p className="intro-description">Đồng hành cùng doanh nghiệp trong quản trị, tài chính và kiến tạo giá trị dài hạn.</p>
          <a className="primary-link" href="#quan-tri">Khám phá chuyên môn <ArrowDown size={18} /></a>
        </div>
      </section>
      <ProfileChapter id="quan-tri" number="02" label="NỀN TẢNG DOANH NGHIỆP" title="Quản trị tốt. Nội lực vững." tags={['Quản trị doanh nghiệp', 'Kiểm soát nội bộ', 'Quản lý rủi ro']}>
        <p>Thầy Hà Long Giang tham gia xây dựng và hoàn thiện hệ thống quản trị, kiểm soát nội bộ và quản lý rủi ro cho các doanh nghiệp thuộc nhiều lĩnh vực.</p>
        <p>Từ thực tiễn vận hành, thầy hướng đến những hệ thống giúp tổ chức hoạt động hiệu quả, minh bạch và sẵn sàng tăng trưởng dài hạn.</p>
        <div className="insight-row"><Check size={18} /><span>Hiệu quả vận hành</span><Check size={18} /><span>Tính minh bạch</span></div>
      </ProfileChapter>
      <ProfileChapter id="tai-chinh" number="03" label="TÀI CHÍNH DOANH NGHIỆP · M&A" title="Tối ưu giá trị. Mở rộng cơ hội." tags={['Tài chính doanh nghiệp', 'Mua bán & sáp nhập', 'Giá trị sau đầu tư']}>
        <p>Với chuyên môn về tài chính doanh nghiệp và M&A, thầy mang đến những phân tích và góc nhìn thực tiễn về quản trị và hoạt động đầu tư.</p>
        <p>Qua đó, hỗ trợ tổ chức nâng cao năng lực cạnh tranh, tối ưu hóa giá trị sau đầu tư và xây dựng nền tảng cho bước phát triển tiếp theo.</p>
        <div className="principle"><span>GÓC NHÌN</span><strong>Giá trị dài hạn bắt đầu từ nền tảng quản trị.</strong></div>
      </ProfileChapter>
      <ProfileChapter id="esg" number="04" label="PHÁT TRIỂN BỀN VỮNG" title="Tăng trưởng có trách nhiệm." tags={['Môi trường', 'Xã hội', 'Quản trị']}>
        <p>Thầy đặc biệt quan tâm đến việc thúc đẩy các thông lệ quản trị hiện đại và tích hợp tiêu chuẩn ESG vào chiến lược phát triển doanh nghiệp.</p>
        <p>Mục tiêu là xây dựng nền tảng phát triển bền vững, giúp tổ chức thích ứng trong bối cảnh kinh doanh thay đổi nhanh chóng.</p>
        <div className="esg-mark" aria-label="ESG: Môi trường, Xã hội, Quản trị"><Globe2 size={34} /><span>E<span> / </span>S<span> / </span>G</span></div>
      </ProfileChapter>
      <ProfileChapter id="hanh-trinh" number="05" label="HỌC HỎI KHÔNG NGỪNG" title="Theo đuổi chuẩn mực quốc tế.">
        <div className="credential"><BookOpen size={24} /><div><span>DANH VỊ CHUYÊN MÔN</span><strong>ICAEW<br />Chartered Accountant</strong></div></div>
        <p>Hành trình chinh phục danh vị ICAEW Chartered Accountant của thầy được Báo Dân trí ghi nhận với phương pháp học tập và phát triển nghề nghiệp khác biệt.</p>
        <p>Đó là tinh thần không ngừng học hỏi và cam kết nâng cao năng lực chuyên môn trong tài chính, kế toán và quản trị doanh nghiệp.</p>
        <a className="text-link" href={links.article} target="_blank" rel="noopener noreferrer">Đọc câu chuyện trên Dân trí <ArrowUpRight size={18} /></a>
      </ProfileChapter>
      <ProfileChapter id="ket-noi" number="06" label="TIẾP TỤC CÂU CHUYỆN" title="Kết nối với thầy Giang.">
        <p>Theo dõi những chia sẻ và góc nhìn của thầy Hà Long Giang qua các kênh cá nhân.</p>
        <div className="social-links">
          <a href={links.facebook} target="_blank" rel="noopener noreferrer"><span className="social-monogram" aria-hidden="true">f</span><span><strong>Facebook</strong><small>Hà Long Giang</small></span><ArrowUpRight size={22} /></a>
          <a href={links.tiktok} target="_blank" rel="noopener noreferrer"><span className="social-monogram" aria-hidden="true">♪</span><span><strong>TikTok</strong><small>@halonggiangg</small></span><ArrowUpRight size={22} /></a>
        </div>
        <p className="closing-note">Quản trị · Tài chính · Phát triển bền vững</p>
      </ProfileChapter>
    </main>
  </>;
}
