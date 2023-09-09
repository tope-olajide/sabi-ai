import Footer from "@/components/Footer";
import Paraphraser from "./Paraphraser";
import Box from "@mui/material/Box";

const ParaphraserPage = () => {
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
        <Paraphraser />
        <Footer />
      </Box>
    </>
  );
};
export default ParaphraserPage;
