import { useEffect, useState } from "react";
import Image from "next/image";
import { bringDpUrlFromFileId } from "@/utils/addTranformation";
import { UserLeaderboard } from "./Icons";
import TooltipIcon from "./TooltipIcon";

type LeaderboardImageProps = {
    imageId: string;
    username: string;
};

const LeaderboardImage = ({ imageId, username }: LeaderboardImageProps) => {
    const [src, setSrc] = useState<string | null>(null);

    useEffect(() => {
        const fetchUrl = async () => {
            try {
                const url = await bringDpUrlFromFileId(imageId);
                setSrc(url);
            } catch (error) {
                console.error("Error fetching image URL Leaderboard", error);
            }
        };

        if (imageId) {
            fetchUrl();
        }
    }, [imageId]);

    if (!src) return (
        <div className="rounded-full text-2xl">
            <UserLeaderboard />
        </div>
    );

    return (
        <TooltipIcon
            icon={
                <Image
                    width={24}
                    height={24}
                    src={src}
                    alt={username}
                    className="inline rounded-full w-6 h-6"
                />
            }
            tooltipText="click to open profile"
        />

    );
};

export default LeaderboardImage;
