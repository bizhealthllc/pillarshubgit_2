import { useState, useEffect } from "react";
import { useFetch } from "../../../hooks/useFetch";

export default function useWidgets() {
  const [widgets, setWidgets] = useState();
  const { data, loading, error, refetch } = useFetch('/api/v1/Widgets');

  useEffect(() => {
    if (data) {
      //var widgets = data.map((w) => ({ ...w, id: `${w.id}` }));
      var sorted = data.sort((a, b) => (a.name > b.name) ? 1 : -1);
      setWidgets([...sorted]);
    }
  }, [data])


  return { widgets: widgets, loading: loading, error: error, refetch };
}

const WidgetTypes = {
  Profile: "profile",
  Rank: "rank",
  Upline: "upline",
  Calendar: "calendar",
  Card: "card",
  Banner: "banner",
  SocialLinks: "social",
  //Report: "report"
}

export { WidgetTypes }
