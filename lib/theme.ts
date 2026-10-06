/** Chế độ đọc đêm chỉ áp dụng ở trang đọc chương. Chạy ngay đầu trang để không nhấp nháy nền trắng. */
export const THEME_SCRIPT = `try{if(/\\/(chuong|chapter|capitulo)\\//.test(location.pathname)&&localStorage.getItem("mptcl:theme")==="dark")document.documentElement.setAttribute("data-theme","dark")}catch(e){}`;
