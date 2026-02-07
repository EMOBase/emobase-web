import { useState } from "react";

import { Icon } from "@/components/ui/icon";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import BeetleLoading from "@/components/common/BeetleLoading";
import ImageHolder from "@/components/common/ImageHolder";
import TableFooter from "@/components/common/TableFooter";

type GOAnnotationReviewProps = {
  id: string;
  title: string;
};

const getPageData = (data: any[], itemsPerPage: number, page: number) => {
  return data.slice(itemsPerPage * (page - 1), itemsPerPage * page);
};

const GOAnnotationReview: React.FC<GOAnnotationReviewProps> = ({
  id,
  title,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const data: any[] = [];
  const loading = false;
  const pageData = getPageData(data, itemsPerPage, page);

  const toggleSelectAll = () => {
    if (selectedIds.length === data.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pageData.map((item) => item.id));
    }
  };

  const toggleSelectItem = (itemId: string) => {
    setSelectedIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const handleBulk = (action: "accept" | "discard") => {
    if (action === "accept") {
    }
    if (action === "discard") {
    }
  };

  return (
    <section
      id={id}
      className="bg-white rounded-2xl shadow-card border overflow-hidden scroll-mt-24"
    >
      <div className="p-6 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-3">
          <Icon name="image" weight={500} className="text-primary text-2xl" />
          <h3 className="text-lg font-bold text-text-primary font-display">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold uppercase tracking-tight bg-amber-100 text-amber-700 rounded-sm border border-amber-200 px-2.5 py-1">
            {data.length} Pending
          </span>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="bg-orange-50/50 border-b border-slate-100 px-8 py-3 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
          <span className="text-xs font-semibold text-primary">
            {selectedIds.length} items selected
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                handleBulk("accept");
              }}
              className="py-2"
            >
              <Icon name="done_all" weight={500} className="text-lg" />
              Accept Selected
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                handleBulk("discard");
              }}
              className="bg-slate-100 text-slate-500 py-2 hover:bg-slate-200/90 hover:text-slate-600"
            >
              <Icon name="delete" weight={500} className="text-lg" />
              Discard Selected
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="text-xs w-12 text-center px-6 py-4">
                <Checkbox
                  checked={
                    pageData.length === 0 || selectedIds.length === 0
                      ? false
                      : selectedIds.length === pageData.length
                        ? true
                        : "indeterminate"
                  }
                  onCheckedChange={toggleSelectAll}
                />
              </th>
              <th className="text-xs px-6 py-4">Term ID & Description</th>
              <th className="text-xs px-6 py-4">Gene ID</th>
              <th className="text-xs px-6 py-4">Date</th>
              <th className="text-xs text-right px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="relative h-40">
                  <BeetleLoading title="Getting Data" />
                </td>
              </tr>
            ) : data.length > 0 ? (
              pageData.map((item) => (
                <tr
                  key={item.id}
                  className={`${selectedIds.includes(item.id) ? "bg-orange-50/20" : "hover:bg-slate-50/30"} transition-colors`}
                >
                  <td className="px-6 py-5 text-center align-top pt-6">
                    <Checkbox
                      checked={selectedIds.includes(item.id)}
                      onCheckedChange={() => toggleSelectItem(item.id)}
                    />
                  </td>

                  <td className="px-6 py-5">
                    <ImageHolder
                      imageId={item.id}
                      status={item.status}
                      height={150}
                    />
                  </td>
                  <td className="px-6 py-5"></td>
                  <td className="px-6 py-5"></td>
                  <td className="px-6 py-5 text-right align-top pt-6">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {}}
                        className="py-2"
                      >
                        <Icon name="check" weight={500} className="text-lg" />
                        Accept
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => {}}
                        className="bg-slate-100 text-slate-500 py-2 hover:bg-slate-200/90 hover:text-slate-600"
                      >
                        <Icon name="close" weight={500} className="text-lg" />
                        Discard
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-slate-400 text-sm"
                >
                  No pending GO annotations
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <TableFooter
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        page={page}
        setPage={setPage}
        totalRecord={data.length}
      />
    </section>
  );
};

export default GOAnnotationReview;
