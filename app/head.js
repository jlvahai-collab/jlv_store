export default function Head() {
  return (
    <head>
      <link rel="icon" href="/favicon.png" sizes="any" />
      
      {/* FontAwesome Link */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css" 
        integrity="sha512-DxV+EoADOkOygM4IR9yXP8Sb2qwgidEmeqAEmDKIOfPRQZOWbXCzLC6vjbZyy0vPisbH2SyW27+ddLVCN+OMzQ==" 
        crossOrigin="anonymous" 
        referrerPolicy="no-referrer" 
      />
      
      {/* Google Fonts Preconnect links */}
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      
      {/* 🌟 FIX: Force lowercase string directly to bypass React boolean translation errors */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      <link 
        href="https://fonts.googleapis.com/css2?family=Eczar:wght@400..800&family=Grenze:ital,wght@0,100..900;1,100..900&display=swap" 
        rel="stylesheet"
      />
    </head>
  );
}
