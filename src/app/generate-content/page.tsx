import Footer from "@/components/Footer";
import ContentGenerator from "./ContentGenerator";
import Box from "@mui/material/Box";

const ContentGeneratorPage = () => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          justifyContent: "space-between",
        }}
      >
        <ContentGenerator />
        <Footer />
      </Box>
    </>
  );
};
export default ContentGeneratorPage;
