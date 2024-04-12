import { CA, TableCA, CAWithQouteCount, CAQoute } from "@/type/ca";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type ContextType = {
  searchCA: CA;
  setSearchCA: Dispatch<SetStateAction<CA>>;
  tableCA: TableCA;
  setTableCA: Dispatch<SetStateAction<TableCA>>;
  cas: CAWithQouteCount[];
  setCAs: Dispatch<SetStateAction<CAWithQouteCount[]>>;
  countCA: number;
  setCountCA: Dispatch<SetStateAction<number>>;
  showCAQoutes: CAQoute[];
  setShowCAQoutes: Dispatch<SetStateAction<CAQoute[]>>;
};

const SearchCAQouteContext = createContext<ContextType | undefined>(undefined);

export function SearchCAQouteProvider({ children }: { children: ReactNode }) {
  const [searchCA, setSearchCA] = useState<CA>({
    ca: "",
    name: "",
    address: "",
  });
  const [tableCA, setTableCA] = useState<TableCA>({
    rowsPerPage: 10,
    page: 0,
  });
  const [cas, setCAs] = useState<CAWithQouteCount[]>([]);
  const [countCA, setCountCA] = useState(0);
  const [showCAQoutes, setShowCAQoutes] = useState<CAQoute[]>([]);
  return (
    <SearchCAQouteContext.Provider
      value={{
        searchCA,
        setSearchCA,
        tableCA,
        setTableCA,
        cas,
        setCAs,
        countCA,
        setCountCA,
        showCAQoutes,
        setShowCAQoutes,
      }}
    >
      {children}
    </SearchCAQouteContext.Provider>
  );
}

export function useSearchCAQoute() {
  const context = useContext(SearchCAQouteContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyProvider");
  }
  return context;
}