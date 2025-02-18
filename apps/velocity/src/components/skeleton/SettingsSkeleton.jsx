import { Skeleton } from "../ui/skeleton";

export const SettingsSkeleton = () => {
  return (
    <div className=" h-full w-full flex flex-col justify-center">
      <div className=" h-1/5 flex justify-center items-center flex-col space-y-2 ">
        <Skeleton className="w-20 h-20 rounded-full" />
        <div className="h-6">
          <Skeleton className="w-[80px] h-6" />
        </div>
      </div>
      <div className="h-3/5 w-full  flex flex-col space-y-4 justify-center items-center ">
        <div className=" flex  space-y-4 flex-col justify-center items-center ">
          <div className="h-6">
            <Skeleton className="w-[600px] h-6" />
          </div>
          <div className="h-6">
            <Skeleton className="w-[600px] h-6" />
          </div>
          <div className="h-6">
            <Skeleton className="w-[600px] h-6" />
          </div>
          <div className="h-6">
            <Skeleton className="w-[600px] h-6" />
          </div>
          <div className="h-6">
            <Skeleton className="w-[600px] h-6" />
          </div>
          <div className="h-6">
            <Skeleton className="w-[600px] h-6" />
          </div>
          <div className="h-6">
            <Skeleton className="w-[600px] h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};
