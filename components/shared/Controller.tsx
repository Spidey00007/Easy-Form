import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Themes from "../data/Themes";
import GradientBG from "../data/GradientBG";
import { Button } from "../ui/button";
import Style from "../data/Style";
import { Checkbox } from "../ui/checkbox";

interface ControllerProps {
  selectedTheme: (theme: string) => void;
  selectedBackground: (Background: string) => void;
  selectedStyle : (Style: any)=>void;
  setSignInEnable:(value: any) =>void;
}

const Controller: React.FC<ControllerProps> = ({ selectedTheme,selectedBackground,selectedStyle,setSignInEnable}) => {
  const [showMore, setShowMore] = useState<number>(6);

  return (
    <div>
      {/* Theme Selection Controller */}
      <h2 className="my-1">Themes</h2>
      <Select onValueChange={(value) => selectedTheme(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          {Themes.map((theme, index) => (
            <SelectItem key={index} value={theme.theme}>
              <div className="flex gap-3">
                <div className="flex">
                  <div className="h-5 w-5 rounded-l-md" style={{ background: theme.primary }}></div>
                  <div className="h-5 w-5" style={{ background: theme.secondary }}></div>
                  <div className="h-5 w-5" style={{ background: theme.accent }}></div>
                  <div className="h-5 w-5 rounded-r-md" style={{ background: theme.neutral }}></div>
                </div>
                {theme.theme}
              </div>
            </SelectItem>
          ))}
          <SelectItem value="light">Light</SelectItem>
        </SelectContent>
      </Select>

      {/* Background Selection Controller */}
      <h2 className="mt-8 my-1">Background</h2>
      <div className="grid grid-cols-3 gap-5">
        {GradientBG.slice(0, showMore).map((bg, index) => (
          <div
            key={index}
            onClick={()=>selectedBackground(bg.gradient)}
            className="w-full h-[70px] rounded-lg hover:border-black hover:border-2 flex hover:scale-105 items-center justify-center cursor-pointer"
            style={{ background: bg.gradient }}
          >
            {index === 0 && 'None'}
          </div>
        ))}
      </div>
      <Button variant="ghost" size="sm" className="w-full my-1" onClick={() => setShowMore(showMore > 6 ? 6 : 20)}>
        {showMore > 6 ? "Show Less" : "Show More"}
      </Button>

      <div>
        <label>Style</label>
        <div className="grid grid-cols-3 gap-3">
          {Style.map((item: any,index:number)=>(
            <div>
              <div className = 'cursor-pointer hover-border-2 rounded-lg ' >
                <img src = {item.img} alt = {item.title} width={600} height={80} className="rounded-lg" onClick={()=>selectedStyle(item)}/>
              </div>
              <h2 className="text-center">{item.name}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 my04 items-center mt-10">
        <Checkbox onCheckedChange={(e) => setSignInEnable(e)}/> <h2>Enable Social Authentication before submitting the form. </h2>
      </div>
    </div>
  );
};

export default Controller;
