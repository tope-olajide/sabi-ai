
import Footer from "@/components/Footer";
import SideBar from "@/components/SideBar";
import Box from "@mui/material/Box";
import GrammarChecker from "./GrammarChecker";
const GrammerCheckerPage = () => {
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
          <GrammarChecker />
          <Footer />
        </SideBar>
      </Box>
    </>
  );
};

export default GrammerCheckerPage;
