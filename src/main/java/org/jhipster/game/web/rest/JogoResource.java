package org.jhipster.game.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.jhipster.game.domain.Jogo;
import org.jhipster.game.repository.JogoRepository;
import org.jhipster.game.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link org.jhipster.game.domain.Jogo}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class JogoResource {

    private final Logger log = LoggerFactory.getLogger(JogoResource.class);

    private static final String ENTITY_NAME = "jogo";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final JogoRepository jogoRepository;

    public JogoResource(JogoRepository jogoRepository) {
        this.jogoRepository = jogoRepository;
    }

    /**
     * {@code POST  /jogos} : Create a new jogo.
     *
     * @param jogo the jogo to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new jogo, or with status {@code 400 (Bad Request)} if the jogo has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/jogos")
    public ResponseEntity<Jogo> createJogo(@RequestBody Jogo jogo) throws URISyntaxException {
        log.debug("REST request to save Jogo : {}", jogo);
        if (jogo.getId() != null) {
            throw new BadRequestAlertException("A new jogo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Jogo result = jogoRepository.save(jogo);
        return ResponseEntity
            .created(new URI("/api/jogos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /jogos/:id} : Updates an existing jogo.
     *
     * @param id the id of the jogo to save.
     * @param jogo the jogo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated jogo,
     * or with status {@code 400 (Bad Request)} if the jogo is not valid,
     * or with status {@code 500 (Internal Server Error)} if the jogo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/jogos/{id}")
    public ResponseEntity<Jogo> updateJogo(@PathVariable(value = "id", required = false) final Long id, @RequestBody Jogo jogo)
        throws URISyntaxException {
        log.debug("REST request to update Jogo : {}, {}", id, jogo);
        if (jogo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, jogo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!jogoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Jogo result = jogoRepository.save(jogo);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, jogo.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /jogos/:id} : Partial updates given fields of an existing jogo, field will ignore if it is null
     *
     * @param id the id of the jogo to save.
     * @param jogo the jogo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated jogo,
     * or with status {@code 400 (Bad Request)} if the jogo is not valid,
     * or with status {@code 404 (Not Found)} if the jogo is not found,
     * or with status {@code 500 (Internal Server Error)} if the jogo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/jogos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Jogo> partialUpdateJogo(@PathVariable(value = "id", required = false) final Long id, @RequestBody Jogo jogo)
        throws URISyntaxException {
        log.debug("REST request to partial update Jogo partially : {}, {}", id, jogo);
        if (jogo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, jogo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!jogoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Jogo> result = jogoRepository
            .findById(jogo.getId())
            .map(existingJogo -> {
                if (jogo.getNome() != null) {
                    existingJogo.setNome(jogo.getNome());
                }
                if (jogo.getAno() != null) {
                    existingJogo.setAno(jogo.getAno());
                }
                if (jogo.getDescricao() != null) {
                    existingJogo.setDescricao(jogo.getDescricao());
                }
                if (jogo.getPreco() != null) {
                    existingJogo.setPreco(jogo.getPreco());
                }
                if (jogo.getImage() != null) {
                    existingJogo.setImage(jogo.getImage());
                }
                if (jogo.getEstoque() != null) {
                    existingJogo.setEstoque(jogo.getEstoque());
                }

                return existingJogo;
            })
            .map(jogoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, jogo.getId().toString())
        );
    }

    /**
     * {@code GET  /jogos} : get all the jogos.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of jogos in body.
     */
    @GetMapping("/jogos")
    public List<Jogo> getAllJogos(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Jogos");
        return jogoRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /jogos/:id} : get the "id" jogo.
     *
     * @param id the id of the jogo to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the jogo, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/jogos/{id}")
    public ResponseEntity<Jogo> getJogo(@PathVariable Long id) {
        log.debug("REST request to get Jogo : {}", id);
        Optional<Jogo> jogo = jogoRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(jogo);
    }

    /**
     * {@code DELETE  /jogos/:id} : delete the "id" jogo.
     *
     * @param id the id of the jogo to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/jogos/{id}")
    public ResponseEntity<Void> deleteJogo(@PathVariable Long id) {
        log.debug("REST request to delete Jogo : {}", id);
        jogoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
