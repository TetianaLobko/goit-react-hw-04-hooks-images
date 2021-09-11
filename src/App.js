import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Api from "./services/FetchAPI";
import Searchbar from "./components/Searchbar";
import ImageGalleryItem from "./components/ImageGallery";
import Modal from "./components/Modal";
import Loader from "./components/Loader";
import Button from "./components/Button";
import "./styles/styles.css";

export default function Finder() {
  const [nameImage, setNameImage] = useState("");
  const [imagesArray, setImagesArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

useEffect(() => {
    if (nameImage === "") {
      return;
    }
    searchImagesFetch();
  }, [nameImage]);

  const searchImagesFetch = () => {
    setLoading(true);

    Api.imagesFetch(nameImage, page, imagesArray)
      .then((imagesArrayFetch) =>
        checkNewFetchImagesArray(imagesArrayFetch.hits)
      )
      .catch((error) => setError(error))
      .finally(
        () => setLoading(false),
        setPage((prevState) => prevState + 1)
      );
  };

const checkNewFetchImagesArray = (imagesArrayFetch) => {
    imagesArrayFetch === []
      ? setImagesArray(imagesArrayFetch)
      : setImagesArray((prevState) => [...prevState, ...imagesArrayFetch]);
  };

  const toggleModal = () => {
        setShowModal(!showModal);
  };

  const isHandleFormSubmit = (nameImage) => {
    reset();
    setNameImage(nameImage);
  };

  const reset = () => {
    setPage(1);
    setImagesArray([]);
  };

  const isCurrentImage = (currentImage, tags) => {
    setSelectedImage([currentImage, tags]);
    setShowModal(true);
  };

  const scrollGallery = () => {
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }, 1000);
  };
  const onClickLoadMore = () => {
    searchImagesFetch();
    scrollGallery();
  };

  return (
    <>
      <Searchbar onSubmit={isHandleFormSubmit} />

      {imagesArray.length === 0 && (
        <div className="container-paragraphInfo">
          <p className="paragraphInfo">
            No images for your query {`${nameImage}`}
          </p>
        </div>
      )}

      {imagesArray && (
        <ImageGalleryItem arrayImages={imagesArray} onSubmit={isCurrentImage} />
      )}
      {showModal && (
        <Modal onClose={() => toggleModal()}>
          <img src={selectedImage[0]} alt={selectedImage[1]} />
        </Modal>
      )}

      <ToastContainer autoClose={3000} />
      {loading && <Loader />}

      {imagesArray.length !== 0 && (
        <Button onClick={onClickLoadMore}>Load more</Button>
      )}
    </>
  );
}
