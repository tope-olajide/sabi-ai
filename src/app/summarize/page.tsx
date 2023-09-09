import Footer from "@/components/Footer";
import Summarize from "./Summarize";
import Box from "@mui/material/Box";

const SummarizePage = () => {
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
        <Summarize />
        <Footer />
      </Box>
    </>
  );
};
export default SummarizePage;
