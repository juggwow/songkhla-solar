import clientPromise from "@/lib/mongodb";
import { MaterialData } from "@/type/ca";
import { useSession } from "next-auth/react";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const noMaterialData = {
  itemList: [],
  thermalPackage: [],
  premuimPackage: [],
  standardPackage: [],
  transformer: [],
  qouterlist: [],
};
const MaterialContext = createContext<MaterialData>(noMaterialData);

export function MaterialProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const [materialData, setMaterialData] = useState<MaterialData | null>();

  useEffect(() => {
    if (status == "authenticated" && !materialData) {
      const data = async () => {
        const res = await fetch("/api/material");
        if (res.status != 200) {
          return;
        }
        const data = await res.json();
        setMaterialData(data as MaterialData);
      };

      data();
    }
  }, [status]);

  return (
    <MaterialContext.Provider
      value={materialData ? materialData : noMaterialData}
    >
      {children}
    </MaterialContext.Provider>
  );
}

export function useMaterial() {
  return useContext(MaterialContext);
}
