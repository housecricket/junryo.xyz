/** Chạy ngay đầu trang: bật chế độ đọc đêm nếu người đọc đã chọn trước đó (không nhấp nháy nền trắng) */
export const THEME_SCRIPT = `try{if(localStorage.getItem("mptcl:theme")==="dark")document.documentElement.setAttribute("data-theme","dark")}catch(e){}`;
