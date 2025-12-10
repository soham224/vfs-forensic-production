import {Routes, Route, useNavigate, useLocation} from "react-router-dom";
import React from "react";
import {LocationUIProvider} from "./LocationUIContext";
import LocationCard from "./LocationCard";
import LocationEditDialog from "./location-details-edit-dialog/LocationEditDialog";
import {ADMIN_URL} from "../../../../../enums/constant";

export default function LocationPage() {
    const locationPageBaseUrl = ADMIN_URL + "/locations";
    const navigate = useNavigate(); // Replaces history
    const location = useLocation(); // Hook to acc

    const locationUIEvents = {
        newLocationBtnClick: () => {
            navigate(`${locationPageBaseUrl}/new`);
        },
        changeStatusLocationBtnClick: (id, status, isDeprecatedStatus) => {
            navigate(
                `${locationPageBaseUrl}/${id}/${status}/${isDeprecatedStatus}/changeStatus`
            );
        },
        editLocationBtnClick: (id) => {
            navigate(`${locationPageBaseUrl}/${id}/edit`);
        },
    };

    const isModalRoute =
        location.pathname.endsWith("/new") || location.pathname.includes("/edit");

    return (
        <LocationUIProvider locationUIEvents={locationUIEvents}>
            {isModalRoute && (
                <Routes>
                    <Route
                        path="new"
                        element={
                            <LocationEditDialog show={true} onHide={() => navigate(locationPageBaseUrl)}/>
                        }
                    />
                    <Route
                        path=":id/edit"
                        element={
                            <LocationEditDialog show={true} onHide={() => navigate(locationPageBaseUrl)}/>
                        }
                    />
                </Routes>
            )}
            <LocationCard/>
        </LocationUIProvider>
    );
}
