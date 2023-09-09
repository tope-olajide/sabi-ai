import Footer from "@/components/Footer";
import Translator from "./Translator";
import Box from "@mui/material/Box";

const TranslatorPage = () => {
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
        <Translator />
        <Footer />
      </Box>
    </>
  );
};
export default TranslatorPage;
