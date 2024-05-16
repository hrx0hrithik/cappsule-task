import React, { useEffect, useState } from "react";
import Button from "./Button";

// Helper function to chunk array into smaller arrays
const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
};

const Card = ({ card }) => {
    const { available_forms, most_common, salt_forms_json, salt } = card;
    const { Form: defaultForm, Strength: defaultStrength, Packing: defaultPacking } = most_common;

    const [selectedForm, setSelectedForm] = useState(defaultForm);
    const [selectedStrength, setSelectedStrength] = useState(defaultStrength);
    const [selectedPackaging, setSelectedPackaging] = useState(defaultPacking);
    const [showMoreForm, setShowMoreForm] = useState(false);
    const [showMoreStrength, setShowMoreStrength] = useState(false);
    const [showMorePackaging, setShowMorePackaging] = useState(false);
    const [notAvailable, setNotAvailable] = useState(false);
    const [availableStrengths, setAvailableStrengths] = useState([]);
    const [availablePackages, setAvailablePackages] = useState([]);
    const [minPrice, setMinPrice] = useState(Infinity);

    useEffect(() => {
        if (!salt_forms_json) return;

        const newAvailableStrengths = salt_forms_json[selectedForm] ? Object.keys(salt_forms_json[selectedForm]) : [];
        const newAvailablePackages = salt_forms_json[selectedForm]?.[selectedStrength]
            ? Object.keys(salt_forms_json[selectedForm][selectedStrength])
            : [];

        setAvailableStrengths(newAvailableStrengths);
        setAvailablePackages(newAvailablePackages);

        if (!newAvailableStrengths.includes(selectedStrength)) {
            setSelectedStrength(newAvailableStrengths[0] || "");
        }
        if (!newAvailablePackages.includes(selectedPackaging)) {
            setSelectedPackaging(newAvailablePackages[0] || "");
        }

        updateAvailabilityAndPrice();
    }, [salt_forms_json, selectedForm, selectedStrength, selectedPackaging]);

    const updateAvailabilityAndPrice = () => {
        const selectedObject = salt_forms_json[selectedForm]?.[selectedStrength]?.[selectedPackaging];

        if (selectedObject) {
            const filteredObject = filterNullValues(selectedObject);
            if (Object.keys(filteredObject).length === 0) {
                setNotAvailable(true);
            } else {
                setNotAvailable(false);
                updateMinPrice(filteredObject);
            }
        } else {
            setNotAvailable(true);
        }
    };

    const filterNullValues = (obj) => {
        return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== null));
    };

    const updateMinPrice = (obj) => {
        let minPrice = Infinity;
        Object.values(obj).forEach((arr) => {
            arr.forEach((item) => {
                if (item.selling_price && item.selling_price < minPrice) {
                    minPrice = item.selling_price;
                }
            });
        });
        setMinPrice(minPrice);
    };

    const handleFormChange = (e) => {
        setSelectedForm(e);
        updateStrengthAndPackaging(e);
    };

    const updateStrengthAndPackaging = (form) => {
        const newAvailableStrengths = salt_forms_json[form] ? Object.keys(salt_forms_json[form]) : [];
        const newAvailablePackages = salt_forms_json[form]?.[newAvailableStrengths[0]]
            ? Object.keys(salt_forms_json[form][newAvailableStrengths[0]])
            : [];

        setSelectedStrength(newAvailableStrengths[0] || "");
        setSelectedPackaging(newAvailablePackages[0] || "");
    };

    const handleStrengthChange = (strength) => {
        setSelectedStrength(strength);
        setSelectedPackaging("");
    };

    const handlePackagingChange = (packaging) => setSelectedPackaging(packaging);

    const isOptionAvailable = (option) => option && Object.values(option).some((value) => value !== null);

    const isStrengthAvailable = (form, strength) => {
        const strengths = salt_forms_json[form]?.[strength];
        return strengths && Object.keys(strengths).some((packaging) => isOptionAvailable(strengths[packaging]));
    };

    const isFormAvailable = (form) => {
        const forms = salt_forms_json[form];
        return forms && Object.keys(forms).some((strength) => isStrengthAvailable(form, strength));
    };

    return (
        <div className="m-5 p-5 h-auto w-full flex justify-between rounded-2xl shadow-card bg-gradient-to-l from-[#D5E7E6] to-[#FFFFFF] to-40%">
            {/* Left */}
            <div className="flex flex-col items-start">
                <OptionSection
                    title="Form"
                    options={available_forms}
                    selectedOption={selectedForm}
                    isAvailable={isFormAvailable}
                    handleChange={handleFormChange}
                    showMore={showMoreForm}
                    setShowMore={setShowMoreForm}
                />
                <OptionSection
                    title="Strength"
                    options={availableStrengths}
                    selectedOption={selectedStrength}
                    isAvailable={(strength) => isStrengthAvailable(selectedForm, strength)}
                    handleChange={handleStrengthChange}
                    showMore={showMoreStrength}
                    setShowMore={setShowMoreStrength}
                />
                <OptionSection
                    title="Packaging"
                    options={availablePackages}
                    selectedOption={selectedPackaging}
                    isAvailable={(packaging) => isOptionAvailable(salt_forms_json[selectedForm]?.[selectedStrength]?.[packaging])}
                    handleChange={handlePackagingChange}
                    showMore={showMorePackaging}
                    setShowMore={setShowMorePackaging}
                />
            </div>
            {/* Middle */}
            <div className="flex flex-col justify-center">
                <div className="font-poppins text-base font-semibold text-[#222222]">{salt}</div>
                <div className="text-xs font-medium font-poppins text-[#2A527A] mt-1">
                    {`${selectedForm} | ${selectedStrength} | ${selectedPackaging}`}
                </div>
            </div>
            {/* Right */}
            <div className="flex justify-center items-center my-8 w-64">
                {notAvailable ? (
                    <div className="bg-white border-[1px] border-[#A7D6D4] flex justify-center items-center rounded-md w-52">
                        <div className="text-sm font-medium font-poppins m-3 text-[#112D31]">
                            No stores selling this product near you
                        </div>
                    </div>
                ) : (
                    <div className="font-extrabold font-poppins text-3xl align-text-bottom text-[#112D31]">
                        From ₹{minPrice}
                    </div>
                )}
            </div>
        </div>
    );
};

const OptionSection = ({ title, options, selectedOption, isAvailable, handleChange, showMore, setShowMore }) => (
    <div className="flex mb-4">
        <div className="text-base w-[86px] text-start mx-2">{title}:</div>
        <div className="flex flex-col">
            {chunkArray(showMore ? options : options.slice(0, 4), 2).map((optionRow, rowIndex) => (
                <div key={rowIndex} className="flex">
                    {optionRow.map((option, index) => (
                        <Button
                            key={index}
                            name={title.toLowerCase()}
                            value={option}
                            label={option}
                            isSelected={selectedOption === option}
                            isAvailable={isAvailable(option)}
                            handleChange={handleChange}
                        />
                    ))}
                </div>
            ))}
        </div>
        {options.length > 4 && (
            <div className="content-end">
                <span
                    className="text-sm font-bold text-[#204772] cursor-pointer"
                    onClick={() => setShowMore(!showMore)}
                >
                    {showMore ? "hide.." : "more.."}
                </span>
            </div>
        )}
    </div>
);

export default Card;
