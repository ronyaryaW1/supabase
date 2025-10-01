import { supabase } from "@/lib/db";
import type { IMenu } from "@/types/menu";
import { useEffect, useState } from "react";

const Home = () => {
  const [menu, setMenu] = useState<IMenu[]>([]);

  useEffect(() => {
    const fetchMenu = async () => {
      const { data, error } = await supabase.from("menus").select("*");

      if (error) console.error('error fetchMenu', error)
      else setMenu(data)
    };

    fetchMenu()
  }, [supabase]);

  console.log('menu', menu)
  return <div>Home</div>;
};

export default Home;