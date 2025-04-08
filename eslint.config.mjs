const config = [
  {
    extends: ["next/core-web-vitals"],
    rules: {
      // 必要に応じてルールを追加
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off"
    }
  }
];

export default config;