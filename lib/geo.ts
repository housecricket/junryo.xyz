// Chọn ngôn ngữ theo vị trí người đọc khi họ mở trang chủ lần đầu.
// Trang là web tĩnh nên không đọc được IP ở máy chủ. Thay vào đó, trình duyệt cho biết múi giờ của máy
// (vd "Asia/Ho_Chi_Minh", "America/Lima"), gần như trùng với quốc gia, không cần gọi dịch vụ ngoài
// và không lộ thông tin gì của người đọc.
//   Múi giờ Việt Nam                 → tiếng Việt
//   Múi giờ các nước nói tiếng Tây Ban Nha (Mỹ Latinh, Tây Ban Nha) → tiếng Tây Ban Nha
//   Còn lại: theo ngôn ngữ trình duyệt (vi / es), không thì tiếng Anh
// Người đọc bấm cờ để đổi thì trang nhớ lựa chọn đó, lần sau không tự chuyển nữa.

export const VI_ZONES = ["Asia/Ho_Chi_Minh", "Asia/Saigon"];

export const ES_ZONES = [
  // Nam Mỹ
  "America/Lima", "America/Bogota", "America/Caracas", "America/Guayaquil", "Pacific/Galapagos",
  "America/La_Paz", "America/Santiago", "America/Punta_Arenas", "Pacific/Easter", "America/Asuncion",
  "America/Montevideo", "America/Buenos_Aires", "America/Argentina/",
  // Trung Mỹ, Caribe, Mexico
  "America/Mexico_City", "America/Cancun", "America/Merida", "America/Monterrey", "America/Matamoros",
  "America/Chihuahua", "America/Ciudad_Juarez", "America/Ojinaga", "America/Mazatlan", "America/Bahia_Banderas",
  "America/Hermosillo", "America/Tijuana", "America/Guatemala", "America/Tegucigalpa", "America/El_Salvador",
  "America/Managua", "America/Costa_Rica", "America/Panama", "America/Havana", "America/Santo_Domingo",
  "America/Puerto_Rico",
  // Tây Ban Nha, Guinea Xích Đạo
  "Europe/Madrid", "Africa/Ceuta", "Atlantic/Canary", "Africa/Malabo",
];

/** Đoạn script chạy ngay đầu trang chủ tiếng Việt, trước khi trang hiện ra, để chuyển hướng nếu cần */
export function geoRedirectScript(base: string) {
  return `(function(){try{
var root=${JSON.stringify(base + "/")};
if(location.pathname!==root&&location.pathname!==${JSON.stringify(base)})return;
if(/bot|crawl|spider|slurp|lighthouse|preview/i.test(navigator.userAgent))return;
var go=function(l){if(l==="en")location.replace(root+"en/"+location.hash);else if(l==="es")location.replace(root+"es/"+location.hash);};
var saved=null;try{saved=localStorage.getItem("mptcl:lang")}catch(e){}
if(saved){go(saved);return;}
var tz="";try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||""}catch(e){}
var VI=${JSON.stringify(VI_ZONES)},ES=${JSON.stringify(ES_ZONES)};
var has=function(list){for(var i=0;i<list.length;i++){var z=list[i];if(z.slice(-1)==="/"?tz.indexOf(z)===0:tz===z)return true}return false};
if(has(VI))return;
if(has(ES)){go("es");return;}
var nl=((navigator.languages&&navigator.languages[0])||navigator.language||"").toLowerCase();
if(nl.indexOf("vi")===0)return;
if(nl.indexOf("es")===0){go("es");return;}
go("en");
}catch(e){}})();`;
}
