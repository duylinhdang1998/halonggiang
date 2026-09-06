import {links} from './profile';
export type ProfileCardData = {label:string;title:string;body:string;note?:string;link?:{label:string;url:string}};
export const cardPairs: [ProfileCardData,ProfileCardData][] = [
 [
  {label:'QUẢN TRỊ DOANH NGHIỆP',title:'Nền tảng vững. Vận hành hiệu quả.',body:'Thầy Hà Long Giang tham gia xây dựng và hoàn thiện hệ thống quản trị cho doanh nghiệp thuộc nhiều lĩnh vực, hướng đến hiệu quả vận hành và khả năng tăng trưởng dài hạn.'},
  {label:'KIỂM SOÁT & RỦI RO',title:'Minh bạch để phát triển.',body:'Xây dựng hệ thống kiểm soát nội bộ và quản lý rủi ro, giúp tổ chức củng cố tính minh bạch và nâng cao hiệu quả hoạt động.',note:'Quản trị · Kiểm soát nội bộ · Quản lý rủi ro'}
 ],
 [
  {label:'TÀI CHÍNH DOANH NGHIỆP',title:'Góc nhìn từ thực tiễn.',body:'Với chuyên môn về tài chính doanh nghiệp, thầy mang đến những phân tích và góc nhìn thực tiễn, hỗ trợ tổ chức nâng cao năng lực cạnh tranh.'},
  {label:'MUA BÁN & SÁP NHẬP',title:'Tối ưu giá trị sau đầu tư.',body:'Những phân tích về quản trị và hoạt động M&A góp phần giúp doanh nghiệp tối ưu hóa giá trị sau đầu tư, tạo nền tảng cho sự phát triển dài hạn.',note:'Tài chính · M&A · Giá trị doanh nghiệp'}
 ],
 [
  {label:'PHÁT TRIỂN BỀN VỮNG',title:'ESG trong chiến lược.',body:'Thầy đặc biệt quan tâm đến việc tích hợp các tiêu chuẩn ESG vào chiến lược phát triển doanh nghiệp.',note:'Môi trường · Xã hội · Quản trị'},
  {label:'TẦM NHÌN DÀI HẠN',title:'Tăng trưởng có trách nhiệm.',body:'Thúc đẩy các thông lệ quản trị hiện đại, xây dựng nền tảng phát triển bền vững trong bối cảnh kinh doanh đang thay đổi nhanh chóng.'}
 ],
 [
  {label:'CHUẨN MỰC QUỐC TẾ',title:'ICAEW Chartered Accountant',body:'Hành trình chinh phục danh vị ICAEW Chartered Accountant của thầy được Báo Dân trí ghi nhận với phương pháp học tập và phát triển nghề nghiệp khác biệt.',link:{label:'Đọc trên Dân trí',url:links.article}},
  {label:'HÀNH TRÌNH CHUYÊN MÔN',title:'CA (Singapore)',body:'Hội viên kỳ cựu ACCA (FCCA), ICAEW Chartered Accountant và Singapore Chartered Accountant. Thầy chia sẻ cột mốc CA (Singapore) qua chương trình chuyển đổi dành cho hội viên ACCA của ISCA.',link:{label:'Đọc chia sẻ của thầy',url:links.singapore}}
 ],
 [
  {label:'KẾT NỐI · FACEBOOK',title:'Hà Long Giang',body:'Theo dõi những chia sẻ và góc nhìn của thầy qua trang Facebook cá nhân.',link:{label:'Mở Facebook',url:links.facebook}},
  {label:'KẾT NỐI · TIKTOK',title:'@halonggiangg',body:'Tiếp tục khám phá những nội dung thầy chia sẻ trên TikTok.',link:{label:'Mở TikTok',url:links.tiktok}}
 ]
];
