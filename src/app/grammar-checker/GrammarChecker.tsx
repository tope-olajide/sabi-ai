import Editor from "@/app/grammar-checker/Editor";
import Footer from "@/components/Footer";
import SideBar from "@/components/SideBar";
import Box from "@mui/material/Box";
const GrammerChecker = () => {
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
        <SideBar pageTitle={"Grammar Checker"}>
          <Editor />
          <Footer />
        </SideBar>
      </Box>
    </>
  );
};

export default GrammerChecker;
