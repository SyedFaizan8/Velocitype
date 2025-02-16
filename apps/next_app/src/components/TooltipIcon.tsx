import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface TooltipIconProps {
    icon?: React.ReactNode | string;
    tooltipText: string;
}

const TooltipIcon: React.FC<TooltipIconProps> = ({ icon, tooltipText }) => (
    <TooltipProvider>
        <Tooltip delayDuration={400} >
            <TooltipTrigger asChild>
                {typeof icon === 'string' ? <span>{icon}</span> : icon ?? <span>?</span>}
            </TooltipTrigger>
            <TooltipContent>
                <p>{tooltipText}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

export default TooltipIcon;