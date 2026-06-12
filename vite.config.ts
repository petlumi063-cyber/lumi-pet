export default defineConfig(() => {
  return {
    base: './', // ◀️ Đã thêm dòng này để đưa tất cả assets về dạng tương đối
    plugins: [react(), tailwindcss()],
    // ... các cấu hình cũ ...
  };
});
