import { useLocation } from "react-router-dom";

export const Page = () => {
    
    const location = useLocation();
    const encodedJson = location.search.split('?data=')[1];
    const jsonData = JSON.parse(decodeURIComponent(encodedJson!));


  return (
    <div className="space-y-6">
        {JSON.stringify(jsonData)}
    </div>
  )
}