import React, { useEffect, useState } from "react";
import Button from "./Button";

const Card = ({ card }) => {
    const { available_forms, most_common, salt_forms_json, salt } = card;
    const {
        Form: defaultForm,
        Strength: defaultStrength,
        Packing: defaultPacking,
    } = most_common;

    const [selectedForm, setSelectedForm] = useState(defaultForm);
    const [selectedStrength, setSelectedStrength] = useState(defaultStrength);
    const [selectedPackaging, setSelectedPackaging] = useState(defaultPacking);
    const [showMoreForm, setShowMoreForm] = useState(false);
    const [showMoreStrength, setShowMoreStrength] = useState(false);
    const [showMorePackaging, setShowMorePackaging] = useState(false);
    const [notAvalabile, setNotAvalabile] = useState(false);
    const [availableStrengths, setAvailableStrengths] = useState([]);
    const [availablePackages, setAvailablePackages] = useState([]);
    // const [isPakageAvailable, setIsPakageAvailable] = useState(false)
    const [minPrice, setMinPrice] = useState(Infinity)

    useEffect(() => {
        if (!salt_forms_json) return;

        setAvailableStrengths(
            salt_forms_json[selectedForm]
                ? Object.keys(salt_forms_json[selectedForm])
                : []
        );
        setAvailablePackages(
            salt_forms_json[selectedForm]?.[selectedStrength]
                ? Object.keys(salt_forms_json[selectedForm][selectedStrength])
                : []
        );

        if (!availableStrengths.includes(selectedStrength)) {
            setSelectedStrength(availableStrengths[0] || "");
        }
        if (!availablePackages.includes(selectedPackaging)) {
            setSelectedPackaging(availablePackages[0] || "");
        }

        const selectedObject =
            salt_forms_json[selectedForm]?.[selectedStrength]?.[selectedPackaging];

        if (selectedObject !== undefined && selectedObject !== null) {
            let newObj = {};

            Object.keys(selectedObject).forEach((key) => {
                const value = selectedObject[key];
                if (value !== null) {
                    newObj[key] = value;
                }
            });
            if (Object.keys(newObj).length === 0) {
                setNotAvalabile(true);
            } else {
                setNotAvalabile(false);
                Object.values(newObj).forEach((arr) => {
                    // Iterate over the values of newObj (arrays of objects)
                    arr.forEach((obj) => {
                        // Iterate over each object in the array
                        if (obj.selling_price && obj.selling_price < minPrice) {
                            setMinPrice(obj.selling_price);
                        }
                    });
                });

                // console.log("Minimum Selling Price:", minPrice);
            }
        } else {
            console.log("Selected object is undefined or null.");
            setNotAvalabile(true);
        }
    }, [salt_forms_json, selectedForm, selectedStrength, selectedPackaging]);

    // useEffect(() => {
    //     if (!salt_forms_json) return;
    //     // console.log(salt_forms_json[available_forms])
    //     // setIsPakageAvailable(Object.values(salt_forms_json[selectedForm][selectedStrength][selectedPackaging]) !== null ? true : false)

    // }, [salt_forms_json, available_forms, availableStrengths, availablePackages])


    const handleFormChange = (e) => {
        const newForm = e.target.value;
        setSelectedForm(newForm);

        // Update available strengths and packages based on the new form
        const newAvailableStrengths = salt_forms_json[newForm]
            ? Object.keys(salt_forms_json[newForm])
            : [];
        const newAvailablePackages = salt_forms_json[newForm]?.[
            newAvailableStrengths[0]
        ]
            ? Object.keys(salt_forms_json[newForm][newAvailableStrengths[0]])
            : [];

        // Set the selected strength and packaging to the first available options for the new form
        setSelectedStrength(newAvailableStrengths[0] || "");
        setSelectedPackaging(newAvailablePackages[0] || "");
    };
    const handleStrengthChange = (e) => {
        setSelectedStrength(e);
        setSelectedPackaging("")
        // console.log(isStrengthAvailable)
    };
    const handlePackagingChange = (e) => setSelectedPackaging(e);

    const isPakageAvailable = (option) => {
        if (!option) return false;
        return Object.values(option).some(packing => packing);
    };

    const isStrengthAvailable = (form, strength) => {
        if (!salt_forms_json[form] || !salt_forms_json[form][strength]) return false;
        return Object.keys(salt_forms_json[form][strength]).some(packaging =>
            isPakageAvailable(salt_forms_json[form][strength][packaging])
        );
    };

    const isFormAvailable = (form) => {
        if (!salt_forms_json[form]) return false;
        return Object.keys(salt_forms_json[form]).some(strength =>
            isStrengthAvailable(form, strength)
        );
    };


    const chunkArray = (array, chunkSize) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    };

    return (
        <div className="m-5 p-5 h-auto w-full flex justify-between rounded-2xl shadow-card bg-gradient-to-l from-[#D5E7E6] to-[#FFFFFF] to-40%">
            {/* left */}
            <div className="flex flex-col items-start">
                <div className="flex">
                    {/* Form */}
                    <div className="text-base w-[86px] text-start mx-2">Form:</div>
                    <div className="flex flex-col">
                        {chunkArray(showMoreForm ? available_forms : available_forms.slice(0, 4), 2).map((formRow, rowIndex) => (
                            <div key={rowIndex} className="flex">
                                {formRow.map((form, index) => (
                                    <Button
                                        key={index}
                                        name="form"
                                        value={form}
                                        label={form}
                                        isSelected={selectedForm === form}
                                        isAvailable={isFormAvailable(form)}
                                        handleChange={handleFormChange}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                    {/* Toggle "more..." and "hide..." buttons */}
                    {available_forms.length > 4 && (
                        <div className="content-end">
                            <span
                                className="text-sm font-bold text-[#204772] cursor-pointer"
                                onClick={() => setShowMoreForm(!showMoreForm)}
                            >
                                {showMoreForm ? "hide.." : "more.."}
                            </span>
                        </div>
                    )}
                </div>
                <div className="flex">
                    {/* Strength */}
                    <div className="text-base w-[86px] text-start mx-2">
                        Strength:
                    </div>
                    <div className="flex flex-col">
                        {chunkArray(salt_forms_json[selectedForm] && showMoreStrength ? availableStrengths : availableStrengths.slice(0, 4), 2).map((strengthRow, rowIndex) => (
                            <div key={rowIndex} className="flex">
                                {strengthRow.map((strength, index) => (
                                    <Button
                                        key={index}
                                        name="strength"
                                        value={strength}
                                        label={strength}
                                        isSelected={selectedStrength === strength}
                                        isAvailable={isStrengthAvailable(selectedForm, strength)}
                                        handleChange={() => handleStrengthChange(strength)}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                    {/* Toggle "more..." and "hide..." buttons */}
                    {availableStrengths.length > 4 && (
                        <div className="content-end">
                            <span
                                className="text-sm font-bold text-[#204772] cursor-pointer"
                                onClick={() => setShowMoreStrength(!showMoreStrength)}
                            >
                                {showMoreStrength ? "hide.." : "more.."}
                            </span>
                        </div>
                    )}
                </div>
                <div className="flex">
                    {/* Packaging */}
                    <div className="text-base w-[86px] text-start mx-2">
                        Packaging:
                    </div>
                    <div className="flex flex-col">
                        {chunkArray(salt_forms_json[selectedForm]?.[selectedStrength] && showMorePackaging ? availablePackages : availablePackages.slice(0, 4), 2).map((packagingRow, rowIndex) => (
                            <div key={rowIndex} className="flex">
                                {packagingRow.map((packaging, index) => (
                                    <Button
                                        key={index}
                                        name="packaging"
                                        value={packaging}
                                        label={packaging}
                                        isAvailable={isPakageAvailable(salt_forms_json[selectedForm][selectedStrength]?.[packaging])}                                        isSelected={selectedPackaging === packaging}
                                        handleChange={() => handlePackagingChange(packaging)}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                    {/* Toggle "more..." and "hide..." buttons */}
                    {availablePackages.length > 4 && (
                        <div className="content-end">
                            <span
                                className=" text-sm font-bold text-[#204772] cursor-pointer"
                                onClick={() => setShowMorePackaging(!showMorePackaging)}
                            >
                                {showMorePackaging ? "hide.." : "more.."}
                            </span>
                        </div>
                    )}
                </div>
            </div>
            {/* middle */}
            <div className="flex flex-col justify-center">
                <div className="font-poppins text-base font-semibold text-[#222222]">
                    {salt}
                </div>
                <div className=" text-xs font-medium font-poppins text-[#2A527A] mt-1">
                    {selectedForm + " "}|{" " + selectedStrength + " "}|
                    {" " + selectedPackaging}
                </div>
            </div>
            {/* Right */}
            <div className="flex justify-center items-center my-8 w-64">
                {notAvalabile ? (
                    <div className="bg-white border-[1px] border-[#A7D6D4] flex justify-center items-center rounded-md w-52">
                        <div className="text-sm font-medium font-poppins m-3 text-[#112D31]">
                            No stores selling this product near you
                        </div>
                    </div>
                ) : (
                    <div className="font-extrabold font-poppins text-3xl align-text-bottom text-[#112D31]">
                        From₹{minPrice}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Card;
