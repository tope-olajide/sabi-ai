import Editor from "@/app/grammar-checker/Editor";
import SideBar from "@/components/SideBar";
const GrammerChecker = () => {
  return (
    <>
      <SideBar pageTitle={'Grammar Checker'}>
        <Editor />
      </SideBar>
    </>
  );
};

export default GrammerChecker;
