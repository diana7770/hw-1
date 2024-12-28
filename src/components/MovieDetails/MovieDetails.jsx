import { useEffect, useState } from "react";
import style from "./MovieDetails.module.css";
import axios from "../../axiosConfig";
import { NavLink } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import { toast } from "react-toastify";

const MovieDetails = ({ id }) => {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/anime/${id}/full`);
        setMovie(response.data.data);
      } catch (err) {
        toast.error(
          err.response?.status === 429
            ? "Too many requests. Try again later."
            : "Failed to fetch movie details."
        );
      }
    };

    fetchData();
  }, [id]);

  if (!movie) {
    return <Loader />;
  }

  const {
    images,
    title,
    title_english,
    episodes,
    duration,
    status,
    genres,
    themes,
    rating,
    studios,
    score,
    synopsis,
  } = movie;

  return (
    <div className={style.container}>
      <div className={style["details-box"]}>
        <img
          className={style.details__photo}
          src={images.webp.large_image_url}
          alt={`${title} poster`}
        />
        <h1 className={style.details__title}>{title_english || title}</h1>
        {title_english && title_english !== title && (
          <h4 className={style.details__subtitle}>{title}</h4>
        )}
      </div>

      <div className={style["details-block"]}>
        <section className={style.information}>
          <h2 className={style.information__title}>Information</h2>
          <ul className={style.information__list}>
            <li>Episodes: {episodes || "--"}</li>
            <li>Episode duration: {duration?.replace("per ep", "") || "--"}</li>
            <li>
              Status: {status?.toLowerCase().replace("airing", "") || "--"}
            </li>
            <li>Genres: {genres?.map((g) => g.name).join(", ") || "--"}</li>
            <li>Themes: {themes?.map((t) => t.name).join(", ") || "--"}</li>
            <li>Rating: {rating || "--"}</li>
            <li>
              Studio:{" "}
              {studios?.[0] ? (
                <NavLink to={`/producers/${studios[0].mal_id}`}>
                  {studios[0].name}
                </NavLink>
              ) : (
                "--"
              )}
            </li>
          </ul>
        </section>

        <section className={style.score}>
          <h2>Score</h2>
          <p>{score ? score.toFixed(1) : "0"}/10</p>
        </section>

        <section className={style.description}>
          <h2>Description</h2>
          <p>{synopsis?.split("[")[0] || "No description available."}</p>
        </section>
      </div>
    </div>
  );
};

export default MovieDetails;
