import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ntrbtzcohxfunjsaqpay.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";
export const supabase = createClient(supabaseUrl, supabaseKey);

export const channel = supabase
  .channel("any")
  .on(
    "postgres_changes",
    { event: "*", schema: "*", table: "SomeTable" },
    (payload) => {
      console.log("Change received for row:" + payload);
    }
  )
  .subscribe();
