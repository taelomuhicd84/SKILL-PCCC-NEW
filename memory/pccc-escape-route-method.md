---
name: pccc-escape-route-method
description: "User's method for tracing evacuation (thoát nạn) routes on Vietnamese PCCC floor plans — which doors count, where routes start, dead ends"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 4a349caa-929f-4b97-be73-064db6401c8d
  modified: 2026-10-16T14:39:43.996Z
---

How the user wants evacuation routes read and drawn on floor plans:

1. Only doors/openings explicitly labeled as escape count: "Lối thoát", "Cửa thoát nạn", "Lối ra thoát nạn" or similar. Any unlabeled door (e.g. main entrance VĐ1, ordinary D-doors) is NOT an escape exit, even if it leads outside. Also exclude stairs marked "thang di chuyển nội bộ, không thoát nạn".
2. Start points: with 2 exits → start at the point midway between them on the travel path and draw arrows to both exits. Still check dead ends separately → start at the farthest point / end of the dead-end path.
3. Dead ends often come from escape stairs (BTB…) arriving from upper floors or basement: the stair/buồng đệm exit door on this floor is a dead-end start, routed to the nearest labeled exit. Read each floor's stair positions to find these. BUT that is not automatically the farthest point: also check every room on the dead-end side — the farthest point INSIDE a room (corner farthest from its door, e.g. "Khu vực nhà bếp" on a hotel ground floor) counts and usually wins. Compare all candidates and take the longest path.
5. Exit dispersal (QCVN 06 cl. 3.2.8, Hình I.4/I.5, as amended): ≥2 exits must be dispersed, distance ≥ ½D (D = largest diagonal of the room / part / floor); ≥ ⅓D if the whole building has sprinklers. Measured as a straight line between the FARTHEST edges of the two exits and must be ≥ 7 m; if < 7 m, re-measure between nearest edges and compare THAT to ½D (user confirmed). If sprinkler status isn't on the drawings, report both the ½D and ⅓D verdicts (user confirmed this is the right approach). Two escape stair enclosures linked by a protected internal/side corridor (per 3.3.5) → measure along the corridor travel path. Room inside a room → use that inner room's own diagonal d.
6. Failures: just mark "CHƯA ĐẠT" and draw a numbered rectangle at the spot with comment "Khoảng cách thiết kế (X m) bé hơn số liệu yêu cầu (Y m)". Anything suspicious (label contradicts drawing, e.g. X-hatched void = lỗ thông tầng/giếng trời labeled "Thang bộ thoát nạn" with no stair → designer mislabel; table mismatches; near-limit lengths) → also rectangle + comment.
7. Sprinkler and other non-escape inputs come from other skills — see project file DU_LIEU_TU_SKILL_KHAC.md; until linked, assume no sprinkler (½D) and mark "tạm tính". Full skill text: SKILL_thoat_nan.md in project root.
4. Use the drawing's own escape arrows, farthest-point marks and route-length tables if present; otherwise derive lengths yourself.

**Why:** Earlier I picked arbitrary start points and used the unlabeled front door as an exit; the user corrected this (2026-10-16, ground-floor hotel plan).
**How to apply:** Any PCCC escape-route annotation or check, including the pccc-checker tool's rules.


**Bổ sung 2026-10-23 (người dùng dạy):** (a) Gian phòng KHÔNG có cửa chống cháy thì điểm xuất phát là ĐIỂM XA NHẤT trong phòng; có cửa chống cháy đúng yêu cầu thì tính từ cửa đó. (b) Đường thoát nạn đo theo ĐƯỜNG ĐI THỰC TẾ, phải né bàn ghế, tủ, thiết bị, cột, vật cản trong phòng hoặc giữa đường; không đo như đường chim bay hay đoạn thẳng. Không biết bố trí vật cản thì ghi CAN_XAC_NHAN. Xem `knowledge/bai-hoc.md` Bài học 22.

**Bổ sung 2026-10-23 (hình minh hoạ):** tuyến thoát nạn vẽ theo GÓC VUÔNG, bám lối đi trống (tường trong phòng → cửa phòng → hành lang → cửa thoát nạn), không vẽ đường chéo cắt qua đồ đạc/tường; đo tổng các đoạn thẳng. Xem Bài học 24.

**Mẫu trình bày 2026-10-23:** ghi chú thoát nạn có chú giải ký hiệu, tuyến góc vuông ghi L từng đoạn + tổng, khung "TÍNH TOÁN THOÁT NẠN" (S sử dụng = S tầng − chiếm chỗ; số người; mật độ = người/S; Bảng G.2a theo bậc), chi tiết cửa sổ thoát khẩn cấp và cửa chống cháy. Xem Bài học 25.
