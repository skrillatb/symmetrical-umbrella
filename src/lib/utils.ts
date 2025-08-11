import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/fr";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("fr");

export function getHumanDate({ created_at, updated_at, updated = false }: {
    created_at: Date;
    updated_at?: Date;
    updated?: boolean;
}) {
    const created = dayjs.utc(created_at).tz("Europe/Paris");
    const updatedDate = updated_at ? dayjs.utc(updated_at).tz("Europe/Paris") : null;
    const isUpdated = updated !== false && updatedDate && updatedDate.isAfter(created);

    return {
        label: isUpdated ? "mis à jour" : "ajouté",
        humanDate: (isUpdated ? updatedDate : created).fromNow(),
    };
}