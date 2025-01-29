import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const TooltipIcon = ({ icon, tooltipText }: { icon: React.ReactNode, tooltipText: string }) => (
    <TooltipProvider>
        <Tooltip delayDuration={400} skipDelayDuration={0}>
            <TooltipTrigger asChild>
                {icon}
            </TooltipTrigger>
            <TooltipContent>
                <p>{tooltipText}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

export default TooltipIcon